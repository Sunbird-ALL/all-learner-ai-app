import React from "react";
import MainLayout from "../../components/Layouts.jsx/MainLayout";
import { Box } from "@mui/material";

const MilestoneFormPage = () => {
  return (
    <MainLayout pageName="milestone-form" showProgress={false} loading={false}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          padding: 3,
        }}
      >
        {/* The form dialog will auto-open via ProfileHeader when on /Reset route */}
      </Box>
    </MainLayout>
  );
};

export default MilestoneFormPage;
