import { ArrowRight, PenTool } from 'lucide-react';
import type { CoverBlock, ElementId, TextId } from './types';
import { cx } from './cx';
import './cover.css';

interface Props {
  block: CoverBlock;
}

export function CoverSection({ block }: Props) {
  const getOffsetStyle = (id: ElementId) => {
    const o = block.offsets[id];
    return o ? { transform: `translate(${o.x}px, ${o.y}px)` } : undefined;
  };

  // Вспомогательная функция для рендера HTML-контента (из Tiptap)
  const renderText = (id: TextId, className: string) => (
    <div className={className} dangerouslySetInnerHTML={{ __html: block.content[id] }} />
  );

  return (
    <section
      className='cv-block'
      data-theme={block.theme}
      data-layout={block.layout}
      data-spacing={block.spacing}
      data-image={block.showImage}
    >
      <div className='cv-inner'>
        <div className='cv-col'>
          
          {/* Eyebrow */}
          <div style={getOffsetStyle('eyebrow')}>
            <div className='cv-eyebrow'>
              <PenTool size={14} />
              {renderText('eyebrow', 'cv-eyebrow-text')}
            </div>
          </div>

          {/* Title */}
          <div style={getOffsetStyle('title')}>
            {renderText('title', 'cv-title')}
          </div>

          {/* Subtitle */}
          <div style={getOffsetStyle('subtitle')}>
            {renderText('subtitle', 'cv-subtitle')}
          </div>

          {/* Primary Button */}
          <div style={getOffsetStyle('primaryButton')}>
            <div className={cx('cv-btn', 'cv-primary')}>
              {renderText('primaryButton', 'cv-btn-text')}
              <ArrowRight size={18} />
            </div>
          </div>

          {/* Secondary Button */}
          <div style={getOffsetStyle('secondaryButton')}>
            <div className={cx('cv-btn', 'cv-ghost')}>
              {renderText('secondaryButton', 'cv-btn-text')}
            </div>
          </div>

          {/* Badges */}
          <div style={getOffsetStyle('badges')}>
            <ul className={'cv-badges'}>
              {block.badges.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Image */}
        {block.showImage && (
          <div style={getOffsetStyle('image')}>
            <div className='cv-block'>
              <div 
                className='cv-image-box' 
                style={{ width: block.image.width, height: block.image.height }}
              >
                {block.image.src && <img src={block.image.src} alt="" />}
              </div>
            </div>
          </div>
        )}
        
      </div>
    </section>
  );
}
