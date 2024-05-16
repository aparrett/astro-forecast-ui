interface LayoutProps {
  children: JSX.Element;
}

interface ErrorBoundaryProps {
  children: JSX.Element;
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface SolarDetailsForHourSlim {
  isDuringSunup?: boolean;
  isDuringTotalDarkness?: boolean;
}

interface SolarDetailsForHourFull {
  isMorning: boolean;
  totalDarkWidth: number;
  astroWidth: number;
  nautWidth: number;
  sunupWidth?: number;
  missingPixelWidth: number;
  missingPixelColor: string;
}
