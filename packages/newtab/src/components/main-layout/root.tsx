import { useEffect, useRef, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useStableResponsiveLayout } from './hooks/use-stable-grid-layout';
import './root.css';
import '../../assets/styles/styles.css';
import '../../assets/styles/example-styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

function Root() {

  const containerRef = useRef<HTMLDivElement>(null);
  
  const [layouts, setLayouts] = useState<ReactGridLayout.Layouts>({
    lg: [
      {
        w: 12,
        h: 1,
        x: 0,
        y: 0,
        i: '0',
        moved: false,
        static: false,
      },
      {
        w: 9,
        h: 2,
        x: 0,
        y: 1,
        i: '1',
        moved: false,
        static: false,
      },
      {
        w: 3,
        h: 2,
        x: 9,
        y: 1,
        i: '2',
        moved: false,
        static: false,
      },
      {
        w: 3,
        h: 2,
        x: 9,
        y: 3,
        i: '3',
        moved: false,
        static: false,
      },
    ],
    sm: [
      {
        w: 6,
        h: 1,
        x: 0,
        y: 0,
        i: '0',
        moved: false,
        static: false,
      },
      {
        w: 4,
        h: 2,
        x: 0,
        y: 1,
        i: '1',
        moved: false,
        static: false,
      },
      {
        w: 2,
        h: 1,
        x: 4,
        y: 1,
        i: '2',
        moved: false,
        static: false,
      },
      {
        w: 2,
        h: 1,
        x: 4,
        y: 2,
        i: '3',
        moved: false,
        static: false,
      },
    ],
  });

  const { ready } = useStableResponsiveLayout(layouts, containerRef);
  const onLayoutChange = (
    currentLayout: ReactGridLayout.Layout[],
    allLayouts: ReactGridLayout.Layouts
  ) => {
    // console.log("currentLayout:", currentLayout);
    // console.log(allLayouts);
    setLayouts(allLayouts);
  };
  const generateDOM = () => {
    return layouts.lg.map((l, i) => {
      return (
        <div key={i} className={l.static ? 'static' : ''}>
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      );
    });
  };
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setFirstRender(false), 200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div ref={containerRef} style={{ height: "100vh", background: "#f8f9fa" }} className="layout-container">
      <ResponsiveGridLayout layouts={layouts} onLayoutChange={onLayoutChange} style={{ visibility: firstRender ? 'hidden' : 'visible' }}>
        {generateDOM()}
      </ResponsiveGridLayout>
    </div>
  );
}

export default Root;
