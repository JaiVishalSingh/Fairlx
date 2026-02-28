"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  CheckCircle2,
  Circle,
  CircleDashed,
  Clock,
  Code,
  Columns3,
  Bug,
  Eye,
  GitBranch,
  Shield,
  Star,
  Users,
  UserCheck,
  Zap,
  Ban,
  AlertCircle,
  CheckSquare,
  ShieldCheck,
  Info,
  Settings,
  Workflow,
  ChevronRight,
  Play,
  Target,
  Lightbulb,
} from "lucide-react";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// Status type colors and labels
const STATUS_TYPES = {
  OPEN: { color: "#6B7280", bgColor: "bg-gray-100", label: "Open", description: "Work not yet started" },
  IN_PROGRESS: { color: "#3B82F6", bgColor: "bg-blue-100", label: "In Progress", description: "Work is being done" },
  CLOSED: { color: "#10B981", bgColor: "bg-green-100", label: "Closed", description: "Work completed" },
};

// Icon component mapper
const IconMap: Record<string, React.ElementType> = {
  Circle,
  CircleDashed,
  Clock,
  Eye,
  CheckCircle,
  UserCheck,
  Star,
  Ban,
  Bug,
  AlertCircle,
  CheckSquare,
  ShieldCheck,
};

// Mini workflow diagram component
const MiniWorkflowDiagram = ({ 
  statuses, 
  transitions,
  title,
  description,
}: { 
  statuses: Array<{ name: string; icon: string; color: string; statusType: keyof typeof STATUS_TYPES }>;
  transitions: Array<{ from: number; to: number; name?: string }>;
  title: string;
  description: string;
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <GitBranch className="size-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative p-4 bg-muted/30 rounded-lg overflow-x-auto">
          <div className="flex items-center justify-start gap-4 min-w-max">
            {statuses.map((status, index) => {
              const Icon = IconMap[status.icon] || Circle;
              const typeInfo = STATUS_TYPES[status.statusType];
              
              return (
                <div key={index} className="flex items-center gap-2">
                  {/* Status Node */}
                  <div 
                    className="flex flex-col items-center p-3 bg-background rounded-lg border-2 shadow-sm min-w-[100px]"
                    style={{ borderColor: status.color }}
                  >
                    <div 
                      className="p-2 rounded-full mb-2"
                      style={{ backgroundColor: `${status.color}20` }}
                    >
                      <Icon className="size-5" style={{ color: status.color }} />
                    </div>
                    <span className="text-xs font-medium text-center">{status.name}</span>
                    <Badge 
                      variant="secondary" 
                      className={cn("text-[10px] mt-1", typeInfo.bgColor)}
                    >
                      {typeInfo.label}
                    </Badge>
                  </div>
                  
                  {/* Arrow to next status */}
                  {index < statuses.length - 1 && (
                    <div className="flex items-center">
                      <ArrowRight className="size-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Transitions legend */}
          <div className="mt-4 pt-3 border-t flex flex-wrap gap-2">
            {transitions.map((t, i) => (
              <Badge key={i} variant="outline" className="text-[10px]">
                {statuses[t.from]?.name} → {statuses[t.to]?.name}
                {t.name && `: ${t.name}`}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Status type explanation component
const StatusTypeCard = ({ 
  type, 
  icon: Icon, 
  examples 
}: { 
  type: keyof typeof STATUS_TYPES; 
  icon: React.ElementType;
  examples: string[];
}) => {
  const info = STATUS_TYPES[type];
  return (
    <div className={cn("p-4 rounded-lg border-2", info.bgColor, "border-transparent")}>
      <div className="flex items-center gap-3 mb-2">
        <div 
          className="p-2 rounded-full"
          style={{ backgroundColor: `${info.color}30` }}
        >
          <Icon className="size-5" style={{ color: info.color }} />
        </div>
        <div>
          <h4 className="font-semibold">{info.label}</h4>
          <p className="text-xs text-muted-foreground">{info.description}</p>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs text-muted-foreground">Examples:</p>
        <div className="flex flex-wrap gap-1">
          {examples.map((ex, i) => (
            <Badge key={i} variant="secondary" className="text-[10px]">
              {ex}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

// Rule example card
const RuleCard = ({
  icon: Icon,
  title,
  description,
  example,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  example: string;
  color: string;
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-start gap-3">
        <div 
          className="p-2 rounded-lg shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="size-5" style={{ color }} />
        </div>
        <div className="space-y-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
          <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
            <span className="text-muted-foreground">Example: </span>
            <span>{example}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const WorkflowGuideClient = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "status-types", label: "Status Types", icon: Circle },
    { id: "templates", label: "Templates", icon: Columns3 },
    { id: "transitions", label: "Transitions", icon: ArrowRight },
    { id: "rules", label: "Rules & Permissions", icon: Shield },
    { id: "best-practices", label: "Best Practices", icon: Lightbulb },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-background border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Workflow className="size-6 text-primary" />
              Workflow Guide
            </h1>
            <p className="text-muted-foreground text-sm">
              Learn how to create and manage workflows for your projects
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-64 border-r bg-muted/20 p-4 hidden md:block">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <section.icon className="size-4" />
                {section.label}
              </button>
            ))}
          </nav>

          <Separator className="my-4" />

          <div className="p-3 bg-primary/10 rounded-lg">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Play className="size-4 text-primary" />
              Quick Start
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Create your first workflow from a template in seconds.
            </p>
            <Button size="sm" className="w-full mt-3" asChild>
              <Link href={`/workspaces/${workspaceId}/spaces`}>
                Go to Spaces
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <ScrollArea className="flex-1">
          <div className="p-6 max-w-4xl mx-auto space-y-8">
            
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">What are Workflows?</h2>
                  <p className="text-muted-foreground">
                    Workflows define how work items (tasks, bugs, stories) move through different stages 
                    in your project. They consist of <strong>statuses</strong> (stages of work) and 
                    <strong> transitions</strong> (allowed movements between stages).
                  </p>
                </div>

                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-900">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                          <Circle className="size-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold">Statuses</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Represent stages like &quot;To Do&quot;, &quot;In Progress&quot;, &quot;Done&quot;
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3">
                          <ArrowRight className="size-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold">Transitions</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Define allowed movements between statuses
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
                          <Shield className="size-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold">Rules</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Control who can make transitions and when
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-green-500" />
                        Benefits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-start gap-2">
                        <ChevronRight className="size-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">Standardize work processes across teams</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ChevronRight className="size-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">Ensure proper approvals before completion</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ChevronRight className="size-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">Track work progress with meaningful stages</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ChevronRight className="size-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">Control access with team-based rules</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Settings className="size-4 text-blue-500" />
                        Key Concepts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Badge className="bg-gray-100 text-gray-700 text-[10px]">Initial</Badge>
                        <span className="text-sm">Starting status for new items</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge className="bg-green-100 text-green-700 text-[10px]">Final</Badge>
                        <span className="text-sm">Completion status (can have multiple)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge className="bg-blue-100 text-blue-700 text-[10px]">Status Type</Badge>
                        <span className="text-sm">Category for analytics (Open/In Progress/Closed)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge className="bg-purple-100 text-purple-700 text-[10px]">Icon</Badge>
                        <span className="text-sm">Visual identifier for each status</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Status Types Section */}
            {activeSection === "status-types" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Understanding Status Types</h2>
                  <p className="text-muted-foreground">
                    Every status belongs to one of three types. These types are used for analytics 
                    and reporting, helping you understand work distribution and flow.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <StatusTypeCard
                    type="OPEN"
                    icon={Circle}
                    examples={["To Do", "Backlog", "Open", "New", "Assigned"]}
                  />
                  <StatusTypeCard
                    type="IN_PROGRESS"
                    icon={Clock}
                    examples={["In Progress", "In Review", "Testing", "Blocked"]}
                  />
                  <StatusTypeCard
                    type="CLOSED"
                    icon={CheckCircle}
                    examples={["Done", "Closed", "Resolved", "Verified"]}
                  />
                </div>

                <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="size-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">How Status Types Work</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Status types are <strong>not</strong> visible to end users - they&apos;re used internally 
                          for analytics. Users see your custom status names and icons. Choose the type that 
                          best represents the work state for accurate reporting.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Choosing Icons</h3>
                  <p className="text-muted-foreground mb-4">
                    Each status can have a unique icon to help users quickly identify work states. 
                    Here are some recommended icons by status type:
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon: Circle, name: "Circle", desc: "Default/To Do" },
                      { icon: CircleDashed, name: "Dashed", desc: "Backlog" },
                      { icon: UserCheck, name: "User Check", desc: "Assigned" },
                      { icon: Star, name: "Star", desc: "Selected" },
                      { icon: Clock, name: "Clock", desc: "In Progress" },
                      { icon: Eye, name: "Eye", desc: "In Review" },
                      { icon: Ban, name: "Ban", desc: "Blocked" },
                      { icon: Bug, name: "Bug", desc: "Bug Status" },
                      { icon: AlertCircle, name: "Alert", desc: "Needs Attention" },
                      { icon: CheckSquare, name: "Check Square", desc: "Fixed" },
                      { icon: ShieldCheck, name: "Shield Check", desc: "Verified" },
                      { icon: CheckCircle, name: "Check Circle", desc: "Done" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <item.icon className="size-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Templates Section */}
            {activeSection === "templates" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Workflow Templates</h2>
                  <p className="text-muted-foreground">
                    Start with a pre-built template that matches your team&apos;s process, 
                    then customize it as needed.
                  </p>
                </div>

                <Tabs defaultValue="software-dev" className="w-full">
                  <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
                    <TabsTrigger value="software-dev" className="text-xs">
                      <Code className="size-3 mr-1" /> Software Dev
                    </TabsTrigger>
                    <TabsTrigger value="kanban" className="text-xs">
                      <Columns3 className="size-3 mr-1" /> Kanban
                    </TabsTrigger>
                    <TabsTrigger value="bug-tracking" className="text-xs">
                      <Bug className="size-3 mr-1" /> Bug Tracking
                    </TabsTrigger>
                    <TabsTrigger value="sprint-agile" className="text-xs">
                      <Zap className="size-3 mr-1" /> Sprint/Agile
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="software-dev" className="space-y-4">
                    <MiniWorkflowDiagram
                      title="Software Development"
                      description="Standard development workflow with code review process"
                      statuses={[
                        { name: "To Do", icon: "Circle", color: "#6B7280", statusType: "OPEN" },
                        { name: "Assigned", icon: "UserCheck", color: "#F59E0B", statusType: "OPEN" },
                        { name: "In Progress", icon: "Clock", color: "#3B82F6", statusType: "IN_PROGRESS" },
                        { name: "In Review", icon: "Eye", color: "#8B5CF6", statusType: "IN_PROGRESS" },
                        { name: "Done", icon: "CheckCircle", color: "#10B981", statusType: "CLOSED" },
                      ]}
                      transitions={[
                        { from: 0, to: 1, name: "Assign" },
                        { from: 1, to: 2, name: "Start Work" },
                        { from: 2, to: 3, name: "Submit for Review" },
                        { from: 3, to: 4, name: "Approve" },
                        { from: 3, to: 2, name: "Request Changes" },
                      ]}
                    />
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">When to Use</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p>✅ Teams with formal code review processes</p>
                        <p>✅ Projects requiring approval before completion</p>
                        <p>✅ Feature development with multiple reviewers</p>
                        <p className="text-muted-foreground mt-3">
                          <strong>Key Feature:</strong> The &quot;Request Changes&quot; transition allows reviewers 
                          to send work back for revisions.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="kanban" className="space-y-4">
                    <MiniWorkflowDiagram
                      title="Simple Kanban"
                      description="Flexible board with free movement between stages"
                      statuses={[
                        { name: "Backlog", icon: "CircleDashed", color: "#9CA3AF", statusType: "OPEN" },
                        { name: "To Do", icon: "Circle", color: "#F59E0B", statusType: "OPEN" },
                        { name: "In Progress", icon: "Clock", color: "#3B82F6", statusType: "IN_PROGRESS" },
                        { name: "Done", icon: "CheckCircle", color: "#10B981", statusType: "CLOSED" },
                      ]}
                      transitions={[
                        { from: 0, to: 1 },
                        { from: 1, to: 2 },
                        { from: 2, to: 3 },
                        { from: 1, to: 0 },
                        { from: 2, to: 1 },
                      ]}
                    />
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">When to Use</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p>✅ Small teams with flexible processes</p>
                        <p>✅ Projects where items can move freely</p>
                        <p>✅ Support/maintenance work</p>
                        <p className="text-muted-foreground mt-3">
                          <strong>Key Feature:</strong> All transitions are allowed, giving maximum 
                          flexibility to team members.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="bug-tracking" className="space-y-4">
                    <MiniWorkflowDiagram
                      title="Bug Tracking"
                      description="Track bugs from report to verified resolution"
                      statuses={[
                        { name: "Open", icon: "Bug", color: "#EF4444", statusType: "OPEN" },
                        { name: "Confirmed", icon: "AlertCircle", color: "#F59E0B", statusType: "OPEN" },
                        { name: "In Progress", icon: "Clock", color: "#3B82F6", statusType: "IN_PROGRESS" },
                        { name: "Fixed", icon: "CheckSquare", color: "#8B5CF6", statusType: "IN_PROGRESS" },
                        { name: "Verified", icon: "ShieldCheck", color: "#10B981", statusType: "CLOSED" },
                      ]}
                      transitions={[
                        { from: 0, to: 1, name: "Confirm Bug" },
                        { from: 1, to: 2, name: "Start Fix" },
                        { from: 2, to: 3, name: "Mark Fixed" },
                        { from: 3, to: 4, name: "Verify Fix" },
                        { from: 3, to: 2, name: "Reopen" },
                      ]}
                    />
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">When to Use</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p>✅ QA teams tracking software bugs</p>
                        <p>✅ Projects requiring bug verification</p>
                        <p>✅ Support teams handling customer issues</p>
                        <p className="text-muted-foreground mt-3">
                          <strong>Key Feature:</strong> Separate &quot;Fixed&quot; and &quot;Verified&quot; stages ensure 
                          bugs are tested before being closed.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="sprint-agile" className="space-y-4">
                    <MiniWorkflowDiagram
                      title="Sprint/Agile"
                      description="Agile workflow with sprint selection and blockers"
                      statuses={[
                        { name: "Backlog", icon: "CircleDashed", color: "#9CA3AF", statusType: "OPEN" },
                        { name: "Selected", icon: "Star", color: "#F59E0B", statusType: "OPEN" },
                        { name: "In Progress", icon: "Clock", color: "#3B82F6", statusType: "IN_PROGRESS" },
                        { name: "Blocked", icon: "Ban", color: "#EF4444", statusType: "IN_PROGRESS" },
                        { name: "Done", icon: "CheckCircle", color: "#10B981", statusType: "CLOSED" },
                      ]}
                      transitions={[
                        { from: 0, to: 1, name: "Select for Sprint" },
                        { from: 1, to: 2, name: "Start Work" },
                        { from: 2, to: 3, name: "Mark Blocked" },
                        { from: 3, to: 2, name: "Unblock" },
                        { from: 2, to: 4, name: "Complete" },
                      ]}
                    />
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">When to Use</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p>✅ Scrum/Agile teams working in sprints</p>
                        <p>✅ Projects with sprint planning ceremonies</p>
                        <p>✅ Teams that need to track blockers</p>
                        <p className="text-muted-foreground mt-3">
                          <strong>Key Feature:</strong> &quot;Selected&quot; status for sprint planning and 
                          &quot;Blocked&quot; status to highlight impediments.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Transitions Section */}
            {activeSection === "transitions" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Configuring Transitions</h2>
                  <p className="text-muted-foreground">
                    Transitions define how work items can move between statuses. 
                    Each transition can have rules that control who can make the move and under what conditions.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Creating Transitions</CardTitle>
                    <CardDescription>
                      In the workflow editor, drag from one status to another to create a transition
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center gap-4 p-6 bg-muted/30 rounded-lg">
                      <div className="p-4 bg-background rounded-lg border-2 border-amber-500">
                        <Circle className="size-6 text-amber-500 mx-auto mb-2" />
                        <span className="text-sm font-medium">To Do</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="px-3 py-1 bg-background border rounded-full text-xs font-medium">
                          Start Work
                        </div>
                        <ArrowRight className="size-8 text-muted-foreground -my-1" />
                      </div>
                      <div className="p-4 bg-background rounded-lg border-2 border-blue-500">
                        <Clock className="size-6 text-blue-500 mx-auto mb-2" />
                        <span className="text-sm font-medium">In Progress</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Transition Properties</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <Target className="size-4 text-blue-500" />
                          Name (Optional)
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          A friendly label shown when users change status. 
                          E.g., &quot;Start Work&quot;, &quot;Submit for Review&quot;, &quot;Approve&quot;
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <Info className="size-4 text-purple-500" />
                          Description (Optional)
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Additional instructions or notes for team members 
                          about when to use this transition.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="size-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Pro Tip: Bidirectional Transitions</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          You can create transitions in both directions between two statuses. 
                          For example, &quot;In Progress → In Review&quot; (Submit) and &quot;In Review → In Progress&quot; (Request Changes). 
                          The workflow editor will offset the labels so they don&apos;t overlap.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Rules Section */}
            {activeSection === "rules" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Rules & Permissions</h2>
                  <p className="text-muted-foreground">
                    Control who can perform transitions with team-based rules and approval workflows.
                  </p>
                </div>

                <div className="grid gap-4">
                  <RuleCard
                    icon={Users}
                    title="Allowed Teams"
                    description="Restrict the transition to members of specific teams only."
                    example='Only the &quot;QA Team&quot; can move items from &quot;Fixed&quot; to &quot;Verified&quot;'
                    color="#3B82F6"
                  />
                  
                  <RuleCard
                    icon={Shield}
                    title="Allowed Roles"
                    description="Restrict by workspace role (Admin, Member, Lead, Owner)."
                    example='Only &quot;Admin&quot; and &quot;Lead&quot; roles can move items to &quot;Done&quot;'
                    color="#8B5CF6"
                  />
                  
                  <RuleCard
                    icon={CheckCircle2}
                    title="Requires Approval"
                    description="The transition creates an approval request instead of moving immediately."
                    example='Moving to &quot;Production&quot; requires approval from the &quot;Release Team&quot;'
                    color="#10B981"
                  />
                  
                  <RuleCard
                    icon={Zap}
                    title="Auto-Transition"
                    description="Automatically perform the transition when conditions are met."
                    example="Auto-move to Done when all subtasks are completed"
                    color="#F59E0B"
                  />
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="team-rules">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        <Users className="size-4" />
                        Setting Up Team-Based Rules
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2">
                      <p className="text-sm text-muted-foreground">
                        Team-based rules ensure that only appropriate team members can make certain transitions:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Click on a transition in the workflow editor</li>
                        <li>Open the &quot;Edit Transition&quot; dialog</li>
                        <li>In &quot;Access Control&quot;, select the allowed teams</li>
                        <li>Optionally, restrict by member roles</li>
                        <li>Save changes</li>
                      </ol>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm">
                        <strong>Note:</strong> If no teams are selected, all workspace members can perform the transition.
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="approval-workflow">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="size-4" />
                        Setting Up Approval Workflows
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2">
                      <p className="text-sm text-muted-foreground">
                        Approval workflows add a gate where designated approvers must confirm the transition:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Edit the transition you want to require approval</li>
                        <li>Enable &quot;Requires Approval&quot; toggle</li>
                        <li>Select the teams that can approve (Approver Teams)</li>
                        <li>When a user tries this transition, an approval request is created</li>
                        <li>An approver from the designated teams approves or rejects</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="use-cases">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        <Lightbulb className="size-4" />
                        Common Use Cases
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2">
                      <div className="space-y-4">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <h4 className="font-medium text-sm mb-1">Code Review Gate</h4>
                          <p className="text-sm text-muted-foreground">
                            In Progress → In Review: Anyone can submit<br />
                            In Review → Done: Only &quot;Senior Dev&quot; team can approve
                          </p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <h4 className="font-medium text-sm mb-1">QA Verification</h4>
                          <p className="text-sm text-muted-foreground">
                            Fixed → Verified: Only &quot;QA Team&quot; members can verify
                          </p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <h4 className="font-medium text-sm mb-1">Production Release</h4>
                          <p className="text-sm text-muted-foreground">
                            Ready → Production: Requires approval from &quot;Release Managers&quot;
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}

            {/* Best Practices Section */}
            {activeSection === "best-practices" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Best Practices</h2>
                  <p className="text-muted-foreground">
                    Follow these recommendations to create effective workflows for your team.
                  </p>
                </div>

                <div className="grid gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
                        Keep It Simple
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p className="mb-2">
                        Start with fewer statuses (4-6) and add more only if needed. Complex workflows 
                        with many statuses can slow down your team.
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700">✓ Good</Badge>
                        <span>To Do → In Progress → Review → Done</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="bg-red-50 text-red-700">✗ Avoid</Badge>
                        <span>10+ statuses for simple projects</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">2</span>
                        Use Meaningful Names
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p className="mb-2">
                        Status names should clearly describe the state of work. Transition names should 
                        be action-oriented.
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700">✓ Good</Badge>
                        <span>&quot;In Code Review&quot;, &quot;Start Work&quot;, &quot;Submit for Review&quot;</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="bg-red-50 text-red-700">✗ Avoid</Badge>
                        <span>&quot;Status 3&quot;, &quot;Move&quot;, &quot;Next&quot;</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">3</span>
                        Allow Backward Transitions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p className="mb-2">
                        Work doesn&apos;t always move forward. Include transitions for reopening or sending 
                        back for revisions.
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700">✓ Include</Badge>
                        <span>&quot;Request Changes&quot;, &quot;Reopen&quot;, &quot;Move Back to Backlog&quot;</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">4</span>
                        Use Rules Sparingly
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p className="mb-2">
                        Too many restrictions can create bottlenecks. Only add rules where they provide 
                        real value (like quality gates).
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700">✓ Good</Badge>
                        <span>Approval required for production deployments</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="bg-red-50 text-red-700">✗ Avoid</Badge>
                        <span>Approval required for every status change</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">5</span>
                        Consider Your Team Size
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>
                        Small teams (2-5 people) often work best with simple Kanban workflows. 
                        Larger teams benefit from more structured workflows with clear handoff points 
                        between roles or teams.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Ready to Create Your Workflow?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Go to a space in your workspace and create a new workflow from one of our templates, 
                      or build one from scratch.
                    </p>
                    <Button asChild>
                      <Link href={`/workspaces/${workspaceId}/spaces`}>
                        <GitBranch className="size-4 mr-2" />
                        Go to Spaces
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
