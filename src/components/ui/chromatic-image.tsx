import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

export type ChromaticImageProps = {
  src: string;
  alt: string;
  children?: ReactNode;
  className?: string;
  imageClassName?: string;
  backgroundColor?: string;
  zoom?: number;
  displacement?: number;
  chromaticShift?: number;
  tilt?: number;
};

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform sampler2D uImage;
uniform vec2 uPointer;
uniform float uImageAspect;
uniform float uCanvasAspect;
uniform float uProgress;
uniform float uZoom;
uniform float uWarp;
uniform float uChromatic;
varying vec2 vUv;

vec2 cover(vec2 uv) {
  if (uImageAspect > uCanvasAspect) {
    uv.x = (uv.x - 0.5) * uCanvasAspect / uImageAspect + 0.5;
  } else {
    uv.y = (uv.y - 0.5) * uImageAspect / uCanvasAspect + 0.5;
  }
  return uv;
}

void main() {
  float strength = uProgress;
  vec2 movement = (uPointer - vec2(0.5)) * vec2(uCanvasAspect, 1.0);
  vec2 direction = movement / max(length(movement), 0.2);

  vec2 baseUv = mix(vUv, vec2(0.5), uZoom * uProgress * 0.28);
  float band = sin(vUv.y * 24.0 + uPointer.x * 5.0);
  float fineBand = sin(vUv.y * 71.0 - uPointer.y * 4.0);
  baseUv.x += (band * 0.72 + fineBand * 0.28) * uWarp * strength * 0.16;
  baseUv.y += direction.y * uWarp * strength * 0.12;
  baseUv = cover(baseUv);

  vec2 split = direction * uChromatic * strength;
  split.x += band * uChromatic * strength * 0.35;
  float red = texture2D(uImage, clamp(baseUv + split, 0.0, 1.0)).r;
  float green = texture2D(uImage, clamp(baseUv, 0.0, 1.0)).g;
  float blue = texture2D(uImage, clamp(baseUv - split, 0.0, 1.0)).b;
  float alpha = texture2D(uImage, clamp(baseUv, 0.0, 1.0)).a;

  gl_FragColor = vec4(red, green, blue, alpha);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function approach(current: number, target: number, speed: number, delta: number) {
  return current + (target - current) * (1 - Math.exp(-speed * delta));
}

function parseColor(color: string): [number, number, number] {
  const value = color.startsWith("#") ? color.slice(1) : "111111";
  const hex =
    value.length === 3
      ? value
          .split("")
          .map((character) => character + character)
          .join("")
      : value;
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
}

export function ChromaticImage({
  src,
  alt,
  children,
  className,
  imageClassName,
  backgroundColor = "#0e0e12",
  zoom = 0.2,
  displacement = 0.045,
  chromaticShift = 0.015,
  tilt = 0.35,
}: ChromaticImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check device capabilities: On touch/mobile devices or reduced motion,
    // skip WebGL context creation completely. The native <img> element renders instantly
    // with zero GPU memory overhead, eliminating mobile stutter and battery drain.
    const isFinePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || prefersReducedMotion) {
      setReady(false);
      return;
    }

    let disposed = false;
    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let vertex: WebGLShader | null = null;
    let fragment: WebGLShader | null = null;
    let buffer: WebGLBuffer | null = null;
    let texture: WebGLTexture | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let frame = 0;
    let isRendering = false;
    let isIntersecting = false;
    let cachedBounds: DOMRect | null = null;

    let onPointerMoveHandler: ((e: PointerEvent) => void) | null = null;
    let onPointerLeaveHandler: (() => void) | null = null;

    const cleanupGL = () => {
      cancelAnimationFrame(frame);
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      container.removeEventListener("pointerenter", handlePointerEnter);
      if (onPointerMoveHandler) container.removeEventListener("pointermove", onPointerMoveHandler);
      if (onPointerLeaveHandler) container.removeEventListener("pointerleave", onPointerLeaveHandler);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.style.transform = "";

      if (gl) {
        if (texture) gl.deleteTexture(texture);
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
        if (vertex) gl.deleteShader(vertex);
        if (fragment) gl.deleteShader(fragment);
      }
      setReady(false);
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cleanupGL();
    };

    const handlePointerEnter = () => {
      cachedBounds = container.getBoundingClientRect();
    };

    const initGL = () => {
      if (gl || disposed) return;

      gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        premultipliedAlpha: false,
        powerPreference: "low-power",
      });
      if (!gl) return;

      canvas.addEventListener("webglcontextlost", handleContextLost, false);

      vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (!vertex || !fragment) return;

      program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);

      const position = gl.getAttribLocation(program, "aPosition");
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const uniforms = {
        image: gl.getUniformLocation(program, "uImage"),
        pointer: gl.getUniformLocation(program, "uPointer"),
        imageAspect: gl.getUniformLocation(program, "uImageAspect"),
        canvasAspect: gl.getUniformLocation(program, "uCanvasAspect"),
        progress: gl.getUniformLocation(program, "uProgress"),
        zoom: gl.getUniformLocation(program, "uZoom"),
        warp: gl.getUniformLocation(program, "uWarp"),
        chromatic: gl.getUniformLocation(program, "uChromatic"),
      };

      gl.uniform1i(uniforms.image, 0);
      gl.uniform1f(uniforms.zoom, zoom);
      gl.uniform1f(uniforms.warp, displacement);
      gl.uniform1f(uniforms.chromatic, chromaticShift);

      texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      const [red, green, blue] = parseColor(backgroundColor);
      gl.clearColor(red, green, blue, 1);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

      const pointer = { x: 0.5, y: 0.5 };
      const pointerTarget = { x: 0.5, y: 0.5 };
      let progress = 0;
      let progressTarget = 0;
      let imageLoaded = false;
      let previousTime = performance.now();

      const resize = () => {
        if (!canvas || !gl) return;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (!width || !height) return;
        // Cap DPR at 1.5 to save 44% GPU fill-rate on high-DPI displays without visual degradation
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        const renderWidth = Math.round(width * pixelRatio);
        const renderHeight = Math.round(height * pixelRatio);
        if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
          canvas.width = renderWidth;
          canvas.height = renderHeight;
          gl.viewport(0, 0, renderWidth, renderHeight);
        }
        gl.uniform1f(uniforms.canvasAspect, width / height);
      };

      const render = (time: number) => {
        if (disposed || !gl || !isIntersecting) {
          isRendering = false;
          return;
        }
        const delta = Math.min((time - previousTime) / 1000, 0.05);
        previousTime = time;
        progress = approach(progress, progressTarget, 10, delta);
        pointer.x = approach(pointer.x, pointerTarget.x, 30, delta);
        pointer.y = approach(pointer.y, pointerTarget.y, 30, delta);

        gl.uniform1f(uniforms.progress, progress);
        gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (imageLoaded) gl.drawArrays(gl.TRIANGLES, 0, 3);

        const rotateX = (0.5 - pointer.y) * tilt * 18;
        const rotateY = (pointer.x - 0.5) * tilt * 18;
        canvas.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.025)`;

        const isSettled =
          Math.abs(progress - progressTarget) < 0.001 &&
          Math.abs(pointer.x - pointerTarget.x) < 0.001 &&
          Math.abs(pointer.y - pointerTarget.y) < 0.001;

        if (isSettled) {
          isRendering = false;
        } else {
          frame = requestAnimationFrame(render);
        }
      };

      const requestRender = () => {
        if (isRendering || !isIntersecting) return;
        isRendering = true;
        previousTime = performance.now();
        frame = requestAnimationFrame(render);
      };

      const updatePointer = (event: PointerEvent) => {
        if (!cachedBounds) cachedBounds = container.getBoundingClientRect();
        pointerTarget.x = (event.clientX - cachedBounds.left) / cachedBounds.width;
        pointerTarget.y = 1 - (event.clientY - cachedBounds.top) / cachedBounds.height;
        progressTarget = 1;
        requestRender();
      };

      const resetPointer = () => {
        cachedBounds = null;
        pointerTarget.x = 0.5;
        pointerTarget.y = 0.5;
        progressTarget = 0;
        requestRender();
      };

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (disposed || !gl) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img
        );
        gl.uniform1f(uniforms.imageAspect, img.naturalWidth / img.naturalHeight);
        imageLoaded = true;
        setReady(true);
        requestRender();
      };
      img.onerror = () => setReady(false);
      img.src = src;

      resizeObserver = new ResizeObserver(() => {
        cachedBounds = null;
        resize();
        requestRender();
      });
      resizeObserver.observe(container);

      onPointerMoveHandler = updatePointer;
      onPointerLeaveHandler = resetPointer;
      container.addEventListener("pointerenter", handlePointerEnter, { passive: true });
      container.addEventListener("pointermove", updatePointer, { passive: true });
      container.addEventListener("pointerleave", resetPointer, { passive: true });

      resize();
      requestRender();
    };

    // Viewport-aware lazy initialization: Only mount WebGL when within 150px of viewport
    let intersectionObserver: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isIntersecting = Boolean(entry?.isIntersecting);
          if (isIntersecting) {
            initGL();
          } else {
            isRendering = false;
            cancelAnimationFrame(frame);
          }
        },
        { rootMargin: "150px" }
      );
      intersectionObserver.observe(container);
    } else {
      isIntersecting = true;
      initGL();
    }

    return () => {
      disposed = true;
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      cleanupGL();
    };
  }, [backgroundColor, displacement, chromaticShift, src, tilt, zoom]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative isolate overflow-hidden bg-neutral-100 dark:bg-neutral-900 select-none",
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
          ready ? "opacity-0" : "opacity-100",
          imageClassName
        )}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          "absolute -inset-[2.5%] h-[105%] w-[105%] will-change-transform transition-opacity duration-300 pointer-events-none",
          ready ? "opacity-100" : "opacity-0"
        )}
      />
      {children}
    </div>
  );
}

export default ChromaticImage;
