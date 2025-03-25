"use client"
import Box from "@mui/material/Box";
import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import React Query modules
import Leftmenu from "@/Menu/Leftmenu";
import { useState } from "react";
import Middletest from "@/Middle/Middletest";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <body>
          <QueryClientProvider client={queryClient}>
            <CssBaseline />
            <Box display="flex" sx={{ background: "black", color: "white", minHeight: "100vh" }}>
              <Box width="20%">
                <Leftmenu />
              </Box>
              <Box width="20%">
                <Middletest/>
              </Box>
              <Box width="60%">{children}</Box>
            </Box>
          </QueryClientProvider>
      </body>
    </html>
  );
}