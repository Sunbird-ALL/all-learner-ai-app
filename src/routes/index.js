import { getConfig } from "../config/runtimeConfig";
/* Route declarations for the app — all views are lazy-loaded for code splitting */
import { lazy } from "react";

// Each view uses a named export, so .then() maps it to the default slot React.lazy() requires
const DiscoverStart = lazy(() =>
  import("../views/DiscoverStart").then((m) => ({ default: m.DiscoverStart }))
);
const Discover = lazy(() =>
  import("../views/Discover").then((m) => ({ default: m.Discover }))
);
const DiscoverEnd = lazy(() =>
  import("../views/DiscoverEnd").then((m) => ({ default: m.DiscoverEnd }))
);
const Assesment = lazy(() =>
  import("../views/Assesment").then((m) => ({ default: m.Assesment }))
);
const PracticePage = lazy(() =>
  import("../views/Practice").then((m) => ({ default: m.PracticePage }))
);
const HomePage = lazy(() =>
  import("../views/HomePage").then((m) => ({ default: m.HomePage }))
);
const NoPageFound = lazy(() =>
  import("../views/NoPageFound").then((m) => ({ default: m.NoPageFound }))
);
const AssesmentEnd = lazy(() =>
  import("../views/AssesmentEnd").then((m) => ({ default: m.AssesmentEnd }))
);
const PracticeRedirectPage = lazy(() =>
  import("../views/PracticeRedirectPage").then((m) => ({
    default: m.PracticeRedirectPage,
  }))
);
const LoginPage = lazy(() =>
  import("../views/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const LetterHunt = lazy(() =>
  import("../views/LetterHunt").then((m) => ({ default: m.LetterHunt }))
);
const TowreFlowPage = lazy(() =>
  import("../views/TowreFlow").then((m) => ({ default: m.TowreFlowPage }))
);
const MilestoneFormPage = lazy(() =>
  import("../views/MilestoneForm").then((m) => ({
    default: m.MilestoneFormPage,
  }))
);
// DEMO ROUTES — remove after demo period
const LetterHuntDemo = lazy(() =>
  import("../views/LetterHuntDemo").then((m) => ({ default: m.LetterHuntDemo }))
);
const LetterLauncherDemo = lazy(() =>
  import("../views/LetterLauncherDemo").then((m) => ({
    default: m.LetterLauncherDemo,
  }))
);
const MemoryDemo = lazy(() =>
  import("../views/MemoryDemo").then((m) => ({ default: m.MemoryDemo }))
);
const DiscoverDemo = lazy(() =>
  import("../views/DiscoverDemo").then((m) => ({ default: m.DiscoverDemo }))
);

const resetMilestoneRoute = {
  id: "route-016",
  path: "/Reset",
  component: MilestoneFormPage,
  requiresAuth: true,
};

const routData = [
  {
    id: "route-001",
    path: "/",
    component: DiscoverStart,
    requiresAuth: true,
  },
  {
    id: "route-002",
    path: "/discover",
    component: Discover,
    requiresAuth: true,
  },
  {
    id: "route-003",
    path: "/discover-start",
    component: DiscoverStart,
    requiresAuth: true,
  },
  {
    id: "route-004",
    path: "/discover-end",
    component: DiscoverEnd,
    requiresAuth: true,
  },
  {
    id: "route-005",
    path: "/practice",
    component: PracticePage,
    requiresAuth: true,
  },
  {
    id: "route-006",
    path: "/assesment",
    component: Assesment,
    requiresAuth: true,
  },
  {
    id: "route-007",
    path: "/assesment-end",
    component: AssesmentEnd,
    requiresAuth: true,
  },
  {
    id: "route-008",
    path: "/level-page",
    component: HomePage,
    requiresAuth: true,
  },
  {
    id: "route-009",
    path: "/_practice",
    component: PracticeRedirectPage,
    requiresAuth: true,
  },
  {
    id: "route-010",
    path: "/login",
    component: LoginPage,
    requiresAuth: false,
  },
  {
    id: "route-011",
    path: "/letter-hunt",
    component: LetterHunt,
    requiresAuth: true,
  },
  {
    id: "route-012",
    path: "/towre-flow",
    component: TowreFlowPage,
    requiresAuth: true,
  },
  ...(getConfig("REACT_APP_ENABLE_RESET_ROUTE") === "true"
    ? [resetMilestoneRoute]
    : []),
  // ============================================
  // DEMO ROUTE - Letter Hunt Game Standalone Demo
  // TODO: Remove this route after demo is complete
  // ============================================
  {
    id: "route-013-demo-level",
    path: "/letter-hunt-demo/:level",
    component: LetterHuntDemo,
    requiresAuth: false,
  },
  {
    id: "route-013-demo",
    path: "/letter-hunt-demo",
    component: LetterHuntDemo,
    requiresAuth: false,
  },
  // ============================================
  // DEMO ROUTE - Letter Launcher Game Standalone Demo
  // TODO: Remove this route after demo is complete
  // ============================================
  {
    id: "route-014-demo-level",
    path: "/letter-launcher-demo/:level",
    component: LetterLauncherDemo,
    requiresAuth: false,
  },
  {
    id: "route-014-demo",
    path: "/letter-launcher-demo",
    component: LetterLauncherDemo,
    requiresAuth: false,
  },
  // ============================================
  // DEMO ROUTE - Memory Challenge Game Standalone Demo
  // TODO: Remove this route after demo is complete
  // ============================================
  {
    id: "route-015-demo-level",
    path: "/memory-demo/:level",
    component: MemoryDemo,
    requiresAuth: false,
  },
  {
    id: "route-015-demo",
    path: "/memory-demo",
    component: MemoryDemo,
    requiresAuth: false,
  },
];

// Conditionally add catch-all route based on auth config
const TOKEN = localStorage.getItem("apiToken");
const isLogin = getConfig("REACT_APP_IS_IN_APP_AUTHORISATION") === "true";

if (isLogin && !TOKEN) {
  routData.push({
    id: "route-000",
    path: "*",
    component: LoginPage,
    requiresAuth: false,
  });
} else {
  routData.push({
    id: "route-000",
    path: "*",
    component: DiscoverStart,
    requiresAuth: false,
  });
}

export default routData;
