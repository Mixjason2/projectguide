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
  borderWidth?: number;
  style?: React.CSSProperties;
}
 
const DraggableResizableBox: React.FC<DraggableResizableBoxProps> = ({
  children,
  defaultWidth = "auto",
  defaultHeight = "auto",
  minWidth = 20,
  minHeight = 20,
  lockAspectRatio = false,
  borderWidth = 2,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: typeof defaultWidth === "number" ? defaultWidth : 200,
    height: typeof defaultHeight === "number" ? defaultHeight : 100,
  });
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const childRef = useRef<HTMLDivElement>(null);
  const positionInitializedRef = useRef(false);
 
useEffect(() => {
  if (positionInitializedRef.current) return;
  if (!childRef.current) return;
 
  const img = childRef.current.querySelector('img');
  let w = 200;
  let h = 100;
 
  if (img) {
    w = defaultWidth === "auto" ? (img as HTMLImageElement).naturalWidth || 200 : (defaultWidth as number);
    h = defaultHeight === "auto" ? (img as HTMLImageElement).naturalHeight || 100 : (defaultHeight as number);
  } else {
    w = defaultWidth === "auto" ? 500 : (defaultWidth as number);
    h = defaultHeight === "auto" ? 100 : (defaultHeight as number);
  }
 
  setSize({ width: w, height: h });
 
  // กำหนดตำแหน่งตรงกลางจอ
  const xPos = window.innerWidth / 2 - w / 2;
  const yPos = window.innerHeight / 2 - h / 2;  // เปลี่ยนเป็น const และไม่ต้องแก้ค่า
 
  setPosition({ x: xPos, y: yPos });
  positionInitializedRef.current = true;
}, [defaultWidth, defaultHeight]);
 
 
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (childRef.current && !childRef.current.contains(e.target as Node)) {
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
  if (!React.isValidElement(children)) return children;
 
  const childElement = children as React.ReactElement;
 
  if (childElement.type === NextImage) {
    const imgElement = childElement as React.ReactElement<ImageProps>;
    return React.cloneElement(imgElement, {
      style: {
        objectFit: 'contain',
        display: 'block',
        userSelect: 'none',
        touchAction: 'none',
        ...imgElement.props.style,
      },
      draggable: false,
    });
  }
 
  const childType = childElement.type;
  const childSrc =
    childElement.props &&
    typeof childElement.props === 'object' &&
    'src' in childElement.props
      ? (childElement.props as { src?: string }).src ?? ''
      : '';
 
  if (childType === 'img' || childSrc.endsWith('.png')) {
    const imgElement = childElement as React.ReactElement<
      React.ImgHTMLAttributes<HTMLImageElement>
    >;
    return React.cloneElement(imgElement, {
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
        userSelect: 'none',
        touchAction: 'none',
        ...imgElement.props.style,
      },
      draggable: false,
    });
  }
 
  return children;
};
 
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const handleSize = isTouchDevice ? 15 : 15;
  const handlePadding = isTouchDevice ? 10 : 0;
 
  const isResizableContent = React.isValidElement(children) && (
    (children.type as React.ElementType) === NextImage ||
    (children.type as React.ElementType) === 'img' ||
    (children.type as React.ElementType) === 'div'
  );
 
 
  const resizeHandleComponent = isSelected && isResizableContent ? {
    top: (
      <div
        style={{
          position: 'absolute',
          top: -handlePadding,
          left: handleSize / 2,
          right: handleSize / 2,
          height: handleSize + handlePadding * 2,
          cursor: 'ns-resize',
          zIndex: 10000,
          background: 'rgba(0,0,0,0.06)',
          borderRadius: 8,
          pointerEvents: 'all',
          touchAction: 'auto',
        }}
        onTouchStart={() => setIsSelected(true)}
        onTouchMove={() => setIsSelected(true)}
      />
    ),
    bottom: (
      <div
        style={{
          position: 'absolute',
          bottom: -handlePadding,
          left: handleSize / 2,
          right: handleSize / 2,
          height: handleSize + handlePadding * 2,
          cursor: 'ns-resize',
          zIndex: 10000,
          background: 'rgba(0,0,0,0.06)',
          borderRadius: 8,
          pointerEvents: 'all',
          touchAction: 'auto',
        }}
        onTouchStart={() => setIsSelected(true)}
        onTouchMove={() => setIsSelected(true)}
      />
    ),
    left: (
      <div
        style={{
          position: 'absolute',
          top: handleSize / 2,
          bottom: handleSize / 2,
          left: -handlePadding,
          width: handleSize + handlePadding * 2,
          cursor: 'ew-resize',
          zIndex: 10000,
          background: 'rgba(0,0,0,0.06)',
          borderRadius: 8,
          pointerEvents: 'all',
          touchAction: 'auto',
        }}
        onTouchStart={() => setIsSelected(true)}
        onTouchMove={() => setIsSelected(true)}
      />
    ),
    right: (
      <div
        style={{
          position: 'absolute',
          top: handleSize / 2,
          bottom: handleSize / 2,
          right: -handlePadding,
          width: handleSize + handlePadding * 2,
          cursor: 'ew-resize',
          zIndex: 10000,
          background: 'rgba(0,0,0,0.06)',
          borderRadius: 8,
          pointerEvents: 'all',
          touchAction: 'auto',
        }}
        onTouchStart={() => setIsSelected(true)}
        onTouchMove={() => setIsSelected(true)}
      />
    ),
    topLeft: (
      <div
        style={{
          position: 'absolute',
          top: -handlePadding,
          left: -handlePadding,
          width: handleSize + handlePadding * 2,
          height: handleSize + handlePadding * 2,
          cursor: 'nwse-resize',
          zIndex: 10001,
          background: 'rgba(0,0,0,0.16)',
          borderRadius: 6,
          pointerEvents: 'all',
          touchAction: 'auto',
        }}
        onTouchStart={() => setIsSelected(true)}
        onTouchMove={() => setIsSelected(true)}
      />
    ),
    topRight: (
      <div
        style={{
          position: 'absolute',
          top: -handlePadding,
          right: -handlePadding,
          width: handleSize + handlePadding * 2,
          height: handleSize + handlePadding * 2,
          cursor: 'nesw-resize',
          zIndex: 10001,
          background: 'rgba(0,0,0,0.16)',
          borderRadius: 6,
          pointerEvents: 'all',
          touchAction: 'auto',
        }}
        onTouchStart={() => setIsSelected(true)}
        onTouchMove={() => setIsSelected(true)}
      />
    ),
    bottomLeft: (
      <div
        style={{
          position: 'absolute',
          bottom: -handlePadding,
          left: -handlePadding,
          width: handleSize + handlePadding * 2,
          height: handleSize + handlePadding * 2,
          cursor: 'nesw-resize',
          zIndex: 10001,
          background: 'rgba(0,0,0,0.16)',
          borderRadius: 6,
          pointerEvents: 'all',
          touchAction: 'auto',
        }}
        onTouchStart={() => setIsSelected(true)}
        onTouchMove={() => setIsSelected(true)}
      />
    ),
    bottomRight: (
      <div
        style={{
          position: 'absolute',
          bottom: -handlePadding,
          right: -handlePadding,
          width: handleSize + handlePadding * 2,
          height: handleSize + handlePadding * 2,
          cursor: 'nwse-resize',
          zIndex: 10001,
          background: 'rgba(0,0,0,0.16)',
          borderRadius: 6,
          pointerEvents: 'all',
          touchAction: 'auto',
        }}
        onTouchStart={() => setIsSelected(true)}
        onTouchMove={() => setIsSelected(true)}
      />
    ),
  } : {};
 
  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      minWidth={minWidth}
      minHeight={minHeight}
      maxWidth={typeof window !== 'undefined' ? window.innerWidth : 1000}
      maxHeight={typeof window !== 'undefined' ? window.innerHeight : 1000}
      lockAspectRatio={lockAspectRatio}
      bounds="window"
      enableResizing={{
        top: true, right: true, bottom: true, left: true,
        topRight: true, bottomRight: true, bottomLeft: true, topLeft: true,
      }}
      resizeHandleComponent={resizeHandleComponent}
      style={{
        border: isSelected ? `${borderWidth}px dashed #777` : 'none',
        borderRadius: '6px',
        display: 'inline-flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        cursor: 'move',
        boxSizing: 'border-box',
        zIndex: isSelected ? 9999 : 1,
        touchAction: 'none',
        userSelect: 'none',
      }}
      onMouseDown={() => setIsSelected(true)}
      onTouchStart={() => setIsSelected(true)}
      onDragStart={() => setIsSelected(true)}
      onResizeStart={() => setIsSelected(true)}
      onTouchMove={() => setIsSelected(true)}
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      onResize={(_e, _direction, ref) => {
        const centerX = position.x + size.width / 2;
        const centerY = position.y + size.height / 2;
        let newWidth = ref.offsetWidth;
        let newHeight = ref.offsetHeight;
 
        if (lockAspectRatio) {
          const ratio = size.width / size.height;
          if (_direction.includes('right') || _direction.includes('left')) {
            newHeight = newWidth / ratio;
          } else {
            newWidth = newHeight * ratio;
          }
        }
 
        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: centerX - newWidth / 2, y: centerY - newHeight / 2 });
        setIsSelected(true);
      }}
 
      onResizeStop={(_e, _direction, ref) => {
 
        const centerX = position.x + size.width / 2;
        const centerY = position.y + size.height / 2;
        let newWidth = ref.offsetWidth;
        let newHeight = ref.offsetHeight;
 
        if (lockAspectRatio) {
          const ratio = size.width / size.height;
          if (_direction.includes('right') || _direction.includes('left')) {
            newHeight = newWidth / ratio;
          } else {
            newWidth = newHeight * ratio;
          }
        }
 
        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: centerX - newWidth / 2, y: centerY - newHeight / 2 });
        setIsSelected(true);
      }}
 
    >
      <div
        ref={childRef}
        style={{
          width: '100%',         // ✅ แก้ตรงนี้
          height: '100%',        // ✅
          minWidth: minWidth,
          minHeight: minHeight,
          position: 'relative',  // สำหรับ Image fill
          overflow: 'hidden',
          whiteSpace: 'normal',
          overflowWrap: 'break-word',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        {renderChildren()}
      </div>
    </Rnd>
  );
};
 
export default DraggableResizableBox;