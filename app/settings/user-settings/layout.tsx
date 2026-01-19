import PageContainer from '@/components/common/PageContainer/PageContainer';

type Props = {
  children: React.ReactNode;
};

export default function UserSettingsLayout({ children }: Props) {
  return <PageContainer>{children}</PageContainer>;
}
