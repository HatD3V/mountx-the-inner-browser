import { MountXProvider } from '@/context/MountXContext';
import { MountXLayout } from '@/components/MountXLayout';

const Index = () => {
  return (
    <MountXProvider>
      <MountXLayout />
    </MountXProvider>
  );
};

export default Index;
