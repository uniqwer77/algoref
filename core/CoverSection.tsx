import type { ReactNode } from 'react';
import { ArrowRight, PenTool } from 'lucide-react';
import type { CoverBlock, ElementId, TextId } from './types';
import { cx } from './cx';
import './cover.css';

export interface CoverSlots {
  renderText?: (id: TextId, className: string) => ReactNode;
  renderElement?: (
    id: ElementId,
    node: ReactNode,
    extra?: { fullWidth?: boolean; lockAspectRatio?: boolean }
  ) => ReactNode;
  renderImage?: (block: CoverBlock) => ReactNode;
  toolbar?: ReactNode;
}

interface Props extends CoverSlots { block: CoverBlock }

export function CoverSection({ block, renderText, renderElement, renderImage, toolbar }: Props) {
  const text =
    renderText ??
    ((id, className) => (
      <div className={className} dangerouslySetInnerHTML={{ __html: block.content[id] }} />
    ));

  const item =
    renderElement ??
    ((id, node) => {
      const o = block.offsets[id];
      return (
        <div style={o ? { transform: `translate(${o.x}px, ${o.y}px)` } : undefined}>
          {node}
        </div>
      );
    });

  const image =
    renderImage ??
    ((b) => (
      <div className='cv-block'>
        <div className='cv-image-box' style={{ width: b.image.width, height: b.image.height }}>
          {b.image.src && <img src={b.image.src} alt="" />}
        </div>
      </div>
    ));

  return (
    <section
      className='cv-block'
      data-block-id={block.id}
      data-theme={block.theme}
      data-layout={block.layout}
      data-spacing={block.spacing}
      data-image={block.showImage}
    >
      {toolbar}

      <div className='cv-inner'>
        <div className='cv-col'>
          {item('eyebrow',
            <div className='cv-eyebrow'>
              <PenTool size={14} />
              {text('eyebrow', 'cv-eyebrow-text')}
            </div>,
          )}
          {item('title', text('title', 'cv-title'))}
          {item('subtitle', text('subtitle', 'cv-subtitle'))}
          {item('primaryButton',
            <div className={cx('cv-btn', 'cv-primary')}>
              {text('primaryButton', 'cv-btn-text')}
              <ArrowRight size={18} />
            </div>,
          )}
          {item('secondaryButton',
            <div className={cx('cv-btn', 'cv-ghost')}>{text('secondaryButton', 'cv-btn-text')}</div>,
          )}
          {item('badges',
            <ul className={'cv-badges'}>
              {block.badges.map((b) => <li key={b}>{b}</li>)}
            </ul>,
          )}
        </div>

        {block.showImage && image(block)}
      </div>
    </section>
  );
}