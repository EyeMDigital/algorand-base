// pages/examples.tsx
import dynamic from "next/dynamic";

// Client-only render to avoid SSR hydration issues with wallet state.
const ExamplesScreen = dynamic(() => import("../screens/ExamplesScreen"), {
  ssr: false,
});

export default function ExamplesPage() {
  return <ExamplesScreen />;
}
