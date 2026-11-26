import { useBuilderStore } from '../store/builderStore';
import { CoverBlockView } from '../blocks/cover/CoverBlockView';

export function Canvas() {
  const blocks = useBuilderStore((s) => s.blocks);

  return (
    <>
      {blocks.map((block, i) => (
        <CoverBlockView key={block.id} block={block} index={i} total={blocks.length} />
      ))}
    </>
  );
}
