import { useRef, useState, type ReactNode } from 'react';
import { Rnd } from 'react-rnd';
import type { ElementBox, Offset, Size } from '../../../../core/types';
import styles from './ResizableElement.module.css';

interface Props {
  offset?: Offset;
  size?: Size;
  disabled?: boolean;
  raised?: boolean;
  align?: 'start' | 'center';
  fullWidth?: boolean;
  lockAspectRatio?: boolean;
  minWidth?: number;
  minHeight?: number;
  children: ReactNode;
  onChange: (box: ElementBox) => void;
  bounds?: string;
}

const HANDLES = {
  top: styles.handleRow,
  right: styles.handleCol,
  bottom: styles.handleRow,
  left: styles.handleCol,
  topLeft: styles.handleCorner,
  topRight: styles.handleCorner,
  bottomLeft: styles.handleCorner,
  bottomRight: styles.handleCorner,
};

export function ResizableElement({
  offset,
  size,
  disabled,
  raised,
  align = 'start',
  fullWidth,
  lockAspectRatio,
  minWidth = 48,
  minHeight = 20,
  bounds,
  children,
  onChange,
}: Props) {
  const [resizing, setResizing] = useState(false);
  const [frozen, setFrozen] = useState<Size | undefined>();
  const startSize = useRef<Size | undefined>(undefined);

  const width = size?.width ?? frozen?.width ?? (fullWidth ? '100%' : 'auto');
  const height = size?.height ?? frozen?.height ?? 'auto';

  const x = offset?.x ?? 0;
  const y = offset?.y ?? 0;

  return (
    <div
      className={styles.slot}
      data-resized={size || resizing ? 'true' : undefined}
      style={{ justifyContent: align === 'center' ? 'center' : 'flex-start' }}
    >
      <Rnd
        className={styles.element}
        style={{
          position: 'relative',
          zIndex: raised ? 30 : undefined,
          touchAction: disabled ? undefined : 'none',
        }}
        bounds={bounds}
        position={{ x, y }}
        size={{ width, height }}
        minWidth={minWidth}
        minHeight={minHeight}
        lockAspectRatio={lockAspectRatio}
        disableDragging={disabled}
        enableResizing={!disabled}
        resizeHandleClasses={HANDLES}
        onDragStop={(_, data) => {
          if (data.x === x && data.y === y) return;
          onChange({ offset: { x: data.x, y: data.y } });
        }}
        onResizeStart={(_, __, ref) => {
          startSize.current = { width: ref.offsetWidth, height: ref.offsetHeight };
        }}
        onResize={(_, __, ___, delta) => {
          if (resizing || (delta.width === 0 && delta.height === 0)) return;
          setFrozen(startSize.current);
          setResizing(true);
        }}
        onResizeStop={(_, __, ref, delta, position) => {
          setResizing(false);
          setFrozen(undefined);
          startSize.current = undefined;
          if (delta.width === 0 && delta.height === 0) return;

          const box: ElementBox = { size: { width: ref.offsetWidth, height: ref.offsetHeight } };
          if (position.x !== x || position.y !== y) box.offset = { x: position.x, y: position.y };
          onChange(box);
        }}
      >
        <div className={styles.content}>{children}</div>
      </Rnd>
    </div>
  );
}
