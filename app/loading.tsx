import { LoadingScreen } from "@/components/loading-screen";

export default function Loading() {
  return (
    <LoadingScreen
      title="An Kun Studio"
      subtitle="Giai điêu ngân vang đâu đây ♩ ♪ ♫ ♬ ♭"
      duration={3000}
      logoUrl={process.env.LOGO}
    />
  );
}
