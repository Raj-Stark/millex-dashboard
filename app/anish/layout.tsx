"use Client";

const AnishLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="bg-amber-300">{children}</div>;
};

export default AnishLayout;
