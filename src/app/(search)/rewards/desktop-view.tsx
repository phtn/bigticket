import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useMemo } from "react";
import { Logo } from "@/app/_components_/navbar/logo";

export const DesktopView = () => {
  const sidebarItems = useMemo(
    () => [
      { icon: "home", label: "Home", active: true },
      { icon: "calendar", label: "Appointments" },
      { icon: "users", label: "Patient List" },
      { icon: "messagecircle", label: "Messages", badge: "5" },
      { icon: "filetext", label: "Resources" },
      { icon: "creditcard", label: "Billing" },
    ],
    [],
  );

  const financeCards = [
    {
      title: "Unpaid invoices",
      amount: "$150",
      bgColor: "bg-finance-unpaid",
      textColor: "text-finance-unpaid-foreground",
      delay: "0ms",
    },
    {
      title: "Account balance",
      amount: "$250",
      bgColor: "bg-finance-balance",
      textColor: "text-finance-balance-foreground",
      delay: "100ms",
    },
    {
      title: "Pending",
      amount: "$500",
      bgColor: "bg-finance-pending",
      textColor: "text-finance-pending-foreground",
      delay: "200ms",
    },
  ];

  const messages = [
    {
      name: "Alice Brown",
      message: "Can we try breathing exer...",
      time: "11:01",
      avatar: "/api/placeholder/40/40",
    },
    {
      name: "Emily Carter",
      message: "Yes, I'll add them.",
      time: "09:18",
      avatar: "/api/placeholder/40/40",
    },
    {
      name: "Michael Lee",
      message: "Thank you for your help!",
      time: "09:18",
      avatar: "/api/placeholder/40/40",
    },
  ];

  const sessionRequests = [
    {
      name: "James Patel",
      time: "Today, 15:00",
      type: "Gestalt Therapy",
      status: "approved",
      avatar: "/api/placeholder/40/40",
    },
    {
      name: "Hannah Collins",
      time: "Tomorrow, 18:30",
      type: "CBT",
      status: "pending",
      avatar: "/api/placeholder/40/40",
    },
    {
      name: "Sara Kim",
      time: "Fri, 10:00",
      type: "ACT Session",
      status: "declined",
      avatar: "/api/placeholder/40/40",
    },
  ];

  const agendaItems = [
    {
      title: "Calm & Focus Group",
      time: "12:30-13:30",
      participants: ["/api/placeholder/32/32", "/api/placeholder/32/32"],
      extras: "+2",
    },
    {
      title: "1:1 with T. Morgan",
      time: "14:30-15:15",
      participants: ["/api/placeholder/32/32"],
    },
    {
      title: "1:1 with S. Green",
      time: "16:30-17:00",
      participants: ["/api/placeholder/32/32"],
    },
    {
      title: "1:1 with M. Carter",
      time: "18:00-19:00",
      participants: ["/api/placeholder/32/32"],
    },
  ];

  const calendarDays = [
    { day: "Mo", date: "12" },
    { day: "Tu", date: "13", active: true },
    { day: "We", date: "14" },
    { day: "Th", date: "15" },
    { day: "Fr", date: "16" },
    { day: "Sa", date: "17" },
    { day: "Su", date: "18" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-screen">
        {/* Sidebar - Fixed at ~17% */}
        <ResizablePanel
          defaultSize={20}
          minSize={20}
          maxSize={20}
          className="border-r-[0.33px] border-border bg-sidebar"
        >
          <div className="flex h-20 items-center">
            <Logo />
          </div>
          <div className="animate-slide-in p-6">
            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <div
                  key={item.label}
                  className={`animate-slide-in flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 ${
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-sidebar-hover text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ animationDelay: `${100 + index * 50}ms` }}
                >
                  <span className="">-|-</span>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge className="ml-auto bg-muted text-xs text-muted-foreground">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              ))}
            </nav>

            {/* Premium Upgrade */}
            <div
              className="animate-fade-in mt-8 rounded-lg border bg-card p-4"
              style={{ animationDelay: "600ms" }}
            >
              <div className="from-info mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br to-success">
                <div className="h-6 w-6 rounded bg-background opacity-80"></div>
              </div>
              <h3 className="mb-1 text-sm font-semibold">Join Premium</h3>
              <p className="mb-3 text-xs text-muted-foreground">$9.99/m</p>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                Explore plans
              </Button>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Main Content - Flexible */}
        <ResizablePanel defaultSize={58} minSize={40}>
          <div className="h-full overflow-y-auto p-8">
            {/* Header */}
            <div className="animate-fade-in mb-8 flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-bold text-foreground">
                  Welcome back, Emily!
                </h1>
                <p className="text-muted-foreground">
                  Easily manage your upcoming sessions and track client progress
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <div className="h-5 w-5 rounded-full bg-muted"></div>
                </Button>
                <Button variant="ghost" size="icon">
                  <div className="h-5 w-5 rounded-full bg-muted"></div>
                </Button>
              </div>
            </div>

            {/* Finance Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {financeCards.map((card) => (
                <Card
                  key={card.title}
                  className={`p-6 ${card.bgColor} animate-scale-in border-0 bg-[#F7D475] transition-transform duration-200 hover:scale-105`}
                  style={{ animationDelay: card.delay }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm ${card.textColor} mb-1 opacity-80`}
                      >
                        {card.title}
                      </p>
                      <p className={`text-2xl font-bold ${card.textColor}`}>
                        {card.amount}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`${card.textColor} hover:bg-white/10`}
                    >
                      <span className="italic">-|-</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Main Content Section */}
            <div className="mb-8 flex gap-8 space-y-8">
              {/* Recent Messages */}
              <Card
                className="animate-fade-in w-full p-6"
                style={{ animationDelay: "400ms" }}
              >
                <h3 className="mb-4 font-semibold">Recent Messages</h3>
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={msg.avatar} />
                        <AvatarFallback>{msg.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {msg.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {msg.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              {/* My Clients */}
              <Card
                className="animate-fade-in w-full p-6"
                style={{ animationDelay: "300ms" }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">My clients</h3>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View all
                  </Button>
                </div>
                <div className="mb-4 text-center">
                  <div className="mb-2 text-3xl font-bold text-foreground">
                    18
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="bg-info h-2 w-2 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">
                      12 sessions this week
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-center">
                    <Avatar className="-mr-2 h-6 w-6 border-2 border-background">
                      <AvatarImage src="/api/placeholder/24/24" />
                    </Avatar>
                    <Avatar className="-mr-2 h-6 w-6 border-2 border-background">
                      <AvatarImage src="/api/placeholder/24/24" />
                    </Avatar>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      +16
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            {/* Session Requests */}
            <div>
              <Card
                className="animate-fade-in p-6"
                style={{ animationDelay: "500ms" }}
              >
                <h3 className="mb-4 font-semibold">Session Requests</h3>
                <div className="space-y-4">
                  <div className="mb-2 grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <span>Client</span>
                    <span>Requested Time</span>
                    <span>Type</span>
                    <span>Status</span>
                  </div>
                  {sessionRequests.map((request, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 items-center gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={request.avatar} />
                          <AvatarFallback>{request.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {request.name}
                        </span>
                      </div>
                      <span className="text-sm">{request.time}</span>
                      <span className="text-sm">{request.type}</span>
                      <Badge
                        className={`w-fit text-xs ${
                          request.status === "approved"
                            ? "bg-kick text-success-foreground"
                            : request.status === "pending"
                              ? "bg-pending text-pending-foreground"
                              : "bg-destructive text-destructive-foreground"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Profile Section - Resizable from 0% to 33%, default 25% */}
        <ResizablePanel defaultSize={30} minSize={30} maxSize={30} collapsible>
          <div className="h-full space-y-8 overflow-y-auto p-8">
            <div className="flex flex-col items-center gap-8">
              <Avatar className="size-36">
                <AvatarImage src="/api/placeholder/48/48" />
                <AvatarFallback>EC</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-sm font-medium">Emily Carter</p>
                <p className="text-xs text-muted-foreground">
                  Clinical Psychologist
                </p>
              </div>
              <Badge className="bg-success text-xs text-success-foreground">
                Available
              </Badge>
            </div>

            {/* My Agenda */}
            <Card
              className="animate-fade-in p-6"
              style={{ animationDelay: "400ms" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">My agenda</h3>
                <Button variant="ghost" size="sm" className="text-primary">
                  View all
                </Button>
              </div>

              {/* Calendar Header */}
              <div className="mb-4 grid grid-cols-7 gap-1">
                {calendarDays.map((day) => (
                  <div key={day.day} className="text-center">
                    <div className="mb-1 text-xs text-muted-foreground">
                      {day.day}
                    </div>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                        day.active
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {day.date}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Agenda Items */}
              <div className="space-y-3">
                {agendaItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {item.participants.map((avatar, i) => (
                        <Avatar
                          key={i}
                          className="-mr-1 h-6 w-6 border border-background"
                        >
                          <AvatarImage src={avatar} />
                        </Avatar>
                      ))}
                      {item.extras && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                          {item.extras}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="mt-4 w-full text-primary">
                All upcoming events
              </Button>
            </Card>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
