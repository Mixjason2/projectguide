'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import NextImage, { ImageProps } from 'next/image';

interface DraggableResizableBoxProps {
  children: React.ReactNode;
  defaultWidth?: number | "auto";
  defaultHeight?: number | "auto";
  minWidth?: number;
  minHeight?: number;
  lockAspectRatio?: boolean;
}

const DraggableResizableBox: React.FC<DraggableResizableBoxProps> = ({
  children,
  defaultWidth = "auto",
  defaultHeight = "auto",
  minWidth = 20,
  minHeight = 20,
  lockAspectRatio = false,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: typeof defaultWidth === "number" ? defaultWidth : 200,
    height: typeof defaultHeight === "number" ? defaultHeight : 100,
  });

  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const childRef = useRef<HTMLDivElement>(null);

  // กึ่งกลางตอนโหลด พร้อมปรับให้พอดีกับรูป
  useEffect(() => {
    if (childRef.current) {
      const img = childRef.current.querySelector('img');
      let w = 200;
      let h = 100;
      if (img) {
        w = defaultWidth === "auto" ? img.naturalWidth || 200 : (defaultWidth as number);
        h = defaultHeight === "auto" ? img.naturalHeight || 100 : (defaultHeight as number);
      }
      const offsetY = -250;
      setSize({ width: w, height: h });
      setPosition({
        x: window.innerWidth / 2 - w / 2,
        y: window.innerHeight / 2 - h / 2 + offsetY,
      });
    }
  }, [defaultWidth, defaultHeight]);

  // hide handles เมื่อ click ข้างนอก + timeout 10 วินาที
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (childRef.current && !(childRef.current as any).contains(e.target)) {
        setIsSelected(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    let timer: NodeJS.Timeout;
    if (isSelected) {
      timer = setTimeout(() => setIsSelected(false), 10000);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      if (timer) clearTimeout(timer);
    };
  }, [isSelected]);

  const renderChildren = () => {
    if (React.isValidElement(children)) {
      if ((children.type as any) === NextImage) {
        const imgElement = children as React.ReactElement<ImageProps>;
        return React.cloneElement(imgElement, {
          style: {
            width: '100%',
            height: '100%',
            objectFit: 'contain', // จะใช้ 'cover' ก็ได้
            display: 'block',
            ...imgElement.props.style,
          },
          key: `${size.width}x${size.height}`,
        });
      } else if (children.type === 'img') {
        const imgElement = children as React.ReactElement<React.ImgHTMLAttributes<HTMLImageElement>>;
        return React.cloneElement(imgElement, {
          style: {
            width: '100%',
            height: '100%',
            objectFit: 'contain', // จะใช้ 'cover' ก็ได้
            display: 'block',
            ...imgElement.props.style,
          },
        });
      }
    }
    return children;
  };

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // เพิ่ม hit area ใหญ่ขึ้นสำหรับ touch02
  const handleSize = isTouchDevice ? 32 : 10; // ปรับขนาด handle ให้เล็กลง
  const handleOffset = handleSize / 2;

  const resizeHandleComponent = isSelected ? {
    top: <div style={{
      width: '100%',
      height: handleSize,
      top: 0,
      left: 0,
      cursor: 'ns-resize',
      position: 'absolute',
      zIndex: 10000,
      touchAction: isTouchDevice ? 'auto' : 'none',
      pointerEvents: 'all',
      background: 'rgba(0,0,0,0.08)',
      boxSizing: 'border-box',
    }} />,
    right: <div style={{
      width: handleSize,
      height: '100%',
      top: 0,
      right: 0,
      cursor: 'ew-resize',
      position: 'absolute',
      zIndex: 10000,
      touchAction: isTouchDevice ? 'auto' : 'none',
      pointerEvents: 'all',
      background: 'rgba(0,0,0,0.08)',
      boxSizing: 'border-box',
    }} />,
    bottom: <div style={{
      width: '100%',
      height: handleSize,
      bottom: 0,
      left: 0,
      cursor: 'ns-resize',
      position: 'absolute',
      zIndex: 10000,
      touchAction: isTouchDevice ? 'auto' : 'none',
      pointerEvents: 'all',
      background: 'rgba(0,0,0,0.08)',
      boxSizing: 'border-box',
    }} />,
    left: <div style={{
      width: handleSize,
      height: '100%',
      top: 0,
      left: 0,
      cursor: 'ew-resize',
      position: 'absolute',
      zIndex: 10000,
      touchAction: isTouchDevice ? 'auto' : 'none',
      pointerEvents: 'all',
      background: 'rgba(0,0,0,0.08)',
      boxSizing: 'border-box',
    }} />,
    topLeft: <div style={{
      width: handleSize,
      height: handleSize,
      top: 0,
      left: 0,
      cursor: 'nwse-resize',
      position: 'absolute',
      zIndex: 10000,
      touchAction: isTouchDevice ? 'auto' : 'none',
      pointerEvents: 'all',
      background: 'rgba(0,0,0,0.18)',
      borderRadius: '50%',
      boxSizing: 'border-box',
    }} />,
    topRight: <div style={{
      width: handleSize,
      height: handleSize,
      top: 0,
      right: 0,
      cursor: 'nesw-resize',
      position: 'absolute',
      zIndex: 10000,
      touchAction: isTouchDevice ? 'auto' : 'none',
      pointerEvents: 'all',
      background: 'rgba(0,0,0,0.18)',
      borderRadius: '50%',
      boxSizing: 'border-box',
    }} />,
    bottomLeft: <div style={{
      width: handleSize,
      height: handleSize,
      bottom: 0,
      left: 0,
      cursor: 'nesw-resize',
      position: 'absolute',
      zIndex: 10000,
      touchAction: isTouchDevice ? 'auto' : 'none',
      pointerEvents: 'all',
      background: 'rgba(0,0,0,0.18)',
      borderRadius: '50%',
      boxSizing: 'border-box',
    }} />,
    bottomRight: <div style={{
      width: handleSize,
      height: handleSize,
      bottom: 0,
      right: 0,
      cursor: 'nwse-resize',
      position: 'absolute',
      zIndex: 10000,
      touchAction: isTouchDevice ? 'auto' : 'none',
      pointerEvents: 'all',
      background: 'rgba(0,0,0,0.18)',
      borderRadius: '50%',
      boxSizing: 'border-box',
    }} />,
  } : {};

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      minWidth={minWidth}
      minHeight={minHeight}
      maxWidth={window.innerWidth}
      maxHeight={window.innerHeight}
      lockAspectRatio={lockAspectRatio} // ใช้ตาม props
      bounds="window"
      enableResizing={{
        top: true, right: true, bottom: true, left: true,
        topRight: true, bottomRight: true, bottomLeft: true, topLeft: true,
      }}
      resizeHandleComponent={resizeHandleComponent}
      style={{
        border: isSelected ? '2px dashed #777' : 'none',
        borderRadius: '6px',
        display: 'inline-flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        cursor: 'move',
        boxSizing: 'border-box',
        zIndex: isSelected ? 9999 : 1,
        touchAction: 'none',
      }}
      onMouseDown={(e: any) => {
        if (!(e.target as HTMLElement).className.includes('rnd-resize-handle')) {
          setIsSelected(true);
        }
      }}
      onTouchStart={(e: any) => {
        if (!(e.target as HTMLElement).className.includes('rnd-resize-handle')) {
          setIsSelected(true);
        }
      }}
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      onResize={(_e, _direction, ref, _delta, pos) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setPosition(pos);
      }}
      onResizeStop={(_e, _direction, ref, _delta, pos) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setPosition(pos);
      }}
    >
      <div
        ref={childRef}
        style={{
          width: size.width,
          height: size.height,
          position: 'relative',
          touchAction: 'none',
        }}
      >
        {renderChildren()}
      </div>
    </Rnd>
  );
};

export default DraggableResizableBox;
