import { CoverSection } from '../../core/CoverSection';
import { createCover } from '../../core/coverDefaults';

export default function App() {
  const block = createCover();

  return (
    <main>
      <CoverSection block={block} />
    </main>
  );
}