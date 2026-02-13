import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  transparentHeader?: boolean;
}

const Layout = ({ children, transparentHeader = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header transparent={transparentHeader} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
