
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/lib/useAuth";
import { RolesProvider } from "@/lib/useRoles";

createRoot(document.getElementById("root")!).render(
	<AuthProvider>
		<RolesProvider>
			<App />
		</RolesProvider>
	</AuthProvider>
);
