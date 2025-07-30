export default function StrategyControlLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="md:pt-10 md:px-10 space-y-10">
      <h1 className="font-bold text-3xl">Strategy Control</h1>
      {children}
    </div>
  );
}
