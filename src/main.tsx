
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/lib/useAuth";

createRoot(document.getElementById("root")!).render(
	<AuthProvider>
		<App />
	</AuthProvider>
);
