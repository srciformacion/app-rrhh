
import { ApplicationsList } from "@/components/UI/ApplicationsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobApplication } from "@/data/jobTypes";
import { ApplicationStatus, User } from "@/data/mockData";

interface ProcessApplicationsTabsProps {
  allApplications: JobApplication[];
  pendingApplications: JobApplication[];
  approvedApplications: JobApplication[];
  rejectedApplications: JobApplication[];
  users: User[];
  activeTab: string;
  setActiveTab: (value: string) => void;
  handleStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
  handleExport: () => void;
}

export function ProcessApplicationsTabs({
  allApplications,
  pendingApplications,
  approvedApplications,
  rejectedApplications,
  users,
  activeTab,
  setActiveTab,
  handleStatusChange,
  handleExport
}: ProcessApplicationsTabsProps) {
  return (
    <Tabs defaultValue="applications" onValueChange={setActiveTab} value={activeTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="applications">
          Todas ({allApplications.length})
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pendientes ({pendingApplications.length})
        </TabsTrigger>
        <TabsTrigger value="approved">
          Aprobadas ({approvedApplications.length})
        </TabsTrigger>
        <TabsTrigger value="rejected">
          Rechazadas ({rejectedApplications.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="applications">
        <ApplicationsList 
          applications={allApplications}
          users={users}
          onStatusChange={handleStatusChange}
          onExportData={handleExport}
        />
      </TabsContent>
      
      <TabsContent value="pending">
        <ApplicationsList 
          applications={pendingApplications}
          users={users}
          onStatusChange={handleStatusChange}
          onExportData={handleExport}
        />
      </TabsContent>
      
      <TabsContent value="approved">
        <ApplicationsList 
          applications={approvedApplications}
          users={users}
          onStatusChange={handleStatusChange}
          onExportData={handleExport}
        />
      </TabsContent>
      
      <TabsContent value="rejected">
        <ApplicationsList 
          applications={rejectedApplications}
          users={users}
          onStatusChange={handleStatusChange}
          onExportData={handleExport}
        />
      </TabsContent>
    </Tabs>
  );
}
