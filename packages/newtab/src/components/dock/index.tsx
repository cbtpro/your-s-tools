import { useState, useEffect } from 'react';
import { Tooltip } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Mail,
  Calendar,
  FileText,
  Settings,
  Users,
  Image,
  Music,
  Video,
  FolderOpen,
} from 'lucide-react';
import DockSettings from './DockSettings';

interface DockItem {
  id: string;
  nameKey: string;
  icon: React.ReactNode;
  color: string;
}

const dockItems: DockItem[] = [
  { id: '1', nameKey: 'apps.home', icon: <Home size={24} />, color: '#3491FA' },
  { id: '2', nameKey: 'apps.mail', icon: <Mail size={24} />, color: '#0FC6C2' },
  { id: '3', nameKey: 'apps.calendar', icon: <Calendar size={24} />, color: '#F77234' },
  { id: '4', nameKey: 'apps.documents', icon: <FileText size={24} />, color: '#00B42A' },
  { id: '5', nameKey: 'apps.team', icon: <Users size={24} />, color: '#722ED1' },
  { id: '6', nameKey: 'apps.photos', icon: <Image size={24} />, color: '#F7BA1E' },
  { id: '7', nameKey: 'apps.music', icon: <Music size={24} />, color: '#F53F3F' },
  { id: '8', nameKey: 'apps.videos', icon: <Video size={24} />, color: '#D91AD9' },
  { id: '9', nameKey: 'apps.files', icon: <FolderOpen size={24} />, color: '#14C9C9' },
  { id: '10', nameKey: 'apps.settings', icon: <Settings size={24} />, color: '#86909C' },
];

export default function Dock() {
  const { t } = useTranslation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [autoHide, setAutoHide] = useState(() => {
    const saved = localStorage.getItem('dockAutoHide');
    return saved ? JSON.parse(saved) : false;
  });
  const [triggerDistance, setTriggerDistance] = useState(() => {
    const saved = localStorage.getItem('dockTriggerDistance');
    return saved ? parseInt(saved) : 100;
  });
  const [isVisible, setIsVisible] = useState(true);
  const [, setMouseY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);

      if (autoHide) {
        const windowHeight = window.innerHeight;
        const distanceFromBottom = windowHeight - e.clientY;

        if (distanceFromBottom <= triggerDistance) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [autoHide, triggerDistance]);

  useEffect(() => {
    localStorage.setItem('dockAutoHide', JSON.stringify(autoHide));
  }, [autoHide]);

  useEffect(() => {
    localStorage.setItem('dockTriggerDistance', triggerDistance.toString());
  }, [triggerDistance]);

  const getScale = (itemId: string, hoveredId: string | null) => {
    if (!hoveredId) return 1;

    const itemIndex = dockItems.findIndex(item => item.id === itemId);
    const hoveredIndex = dockItems.findIndex(item => item.id === hoveredId);
    const distance = Math.abs(itemIndex - hoveredIndex);

    if (distance === 0) return 1.6;
    if (distance === 1) return 1.3;
    if (distance === 2) return 1.1;
    return 1;
  };

  const handleItemClick = (id: string) => {
    if (id === '10') {
      setSettingsVisible(true);
    } else {
      setActiveId(activeId === id ? null : id);
    }
  };

  const handleResetToDefault = () => {
    setAutoHide(false);
    setTriggerDistance(100);
  };

  return (
    <>
      <DockSettings
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        autoHide={autoHide}
        onAutoHideChange={setAutoHide}
        triggerDistance={triggerDistance}
        onTriggerDistanceChange={setTriggerDistance}
        onResetToDefault={handleResetToDefault}
      />

      <div
        className="fixed bottom-0 left-0 right-0 flex justify-center items-end pointer-events-none transition-all duration-300 ease-in-out"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          paddingBottom: isVisible ? '16px' : '0',
        }}
      >
        <div className="pointer-events-auto">
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl px-3 py-2 shadow-2xl border border-gray-200/50">
          <div className="flex items-end gap-2">
            {dockItems.map((item) => {
              const scale = getScale(item.id, hoveredId);
              const isActive = activeId === item.id;
              const isHovered = hoveredId === item.id;

              return (
                <Tooltip
                  key={item.id}
                  content={t(item.nameKey)}
                  position="top"
                >
                  <div
                    className="relative cursor-pointer transition-transform duration-300 ease-out"
                    style={{
                      transform: `scale(${scale}) translateY(${scale > 1 ? -8 * (scale - 1) : 0}px)`,
                      zIndex: isHovered ? 50 : 10,
                    }}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
                      style={{
                        backgroundColor: item.color,
                        color: 'white',
                      }}
                    >
                      {item.icon}
                    </div>

                    {isActive && (
                      <div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                  </div>
                </Tooltip>
              );
            })}
          </div>

          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
        </div>
      </div>
      </div>
    </>
  );
}
