// Log explorer page
'use client'
import { AppSidebar } from "../../components/app-sidebar"
import { ChartAreaInteractive } from "../../components/chart-area-interactive"
import { DataTable } from "../../components/data-table"
import { SectionCards } from "../../components/section-cards"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, ChevronsUpDown, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

import data from "./data.json"

// Sample applications data
const applications = [
  { id: "app1", name: "Nocpro", status: "healthy" },
  { id: "app2", name: "Irongate", status: "warning" },
  { id: "app3", name: "SAC", status: "error" },
  { id: "app4", name: "Aagnoc", status: "healthy" },
];

export default function Page() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [search, setSearch] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(false)

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader siteName="Log Explorer" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between md:w-[200px]"
                        >
                          {value
                            ? applications.find((app) => app.id === value)?.name
                            : "Select application..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 md:w-[200px]">
                        <Command>
                          <CommandInput 
                            placeholder="Search application..." 
                            value={search}
                            onValueChange={setSearch}
                          />
                          <CommandEmpty>No application found.</CommandEmpty>
                          <CommandGroup>
                            {filteredApplications.map((app) => (
                              <CommandItem
                                key={app.id}
                                value={app.id}
                                onSelect={(currentValue) => {
                                  setValue(currentValue === value ? "" : currentValue)
                                  setOpen(false)
                                }}
                              >
                                <span className="flex items-center gap-2">
                                  <span className={`h-2 w-2 rounded-full ${
                                    app.status === 'healthy' ? 'bg-[#00C851]' :
                                    app.status === 'warning' ? 'bg-[#FFBB33]' :
                                    'bg-[#FF4444]'
                                  }`} />
                                  {app.name}
                                </span>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    value === app.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <div className="flex gap-2">
                      <Select>
                        <SelectTrigger className="w-[120px] md:w-[140px]">
                          <SelectValue placeholder="Severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Severity</SelectItem>
                          <SelectItem value="error" className="text-[#FF4444]">ERROR</SelectItem>
                          <SelectItem value="warn" className="text-[#FFBB33]">WARN</SelectItem>
                          <SelectItem value="info" className="text-[#00C851]">INFO</SelectItem>
                          <SelectItem value="debug" className="text-[#33B5E5]">DEBUG</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select>
                        <SelectTrigger className="w-[120px] md:w-[140px]">
                          <SelectValue placeholder="Line Count" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100 lines</SelectItem>
                          <SelectItem value="200">200 lines</SelectItem>
                          <SelectItem value="500">500 lines</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Live</span>
                        <Switch
                            checked={autoRefresh}
                            onCheckedChange={setAutoRefresh}
                        />
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="text" 
                      placeholder="Search logs..." 
                      className="w-full md:w-64"
                    />
                    <Button>
                      Export
                    </Button>
                  </div>
                </div>
              </div>

              {/* Log Entries */}
              <div className="flex flex-col gap-2 p-4">
                {[...Array(10)].map((_, i) => (
                  <Card key={i} className="group relative p-4 hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <Badge className={`${
                        i % 4 === 0 ? 'bg-[#FF4444] text-white' : 
                        i % 4 === 1 ? 'bg-[#FFBB33] text-white' : 
                        i % 4 === 2 ? 'bg-[#00C851] text-white' : 
                        'bg-[#33B5E5] text-white'
                      }`}>
                        {i % 4 === 0 ? 'ERROR' : 
                         i % 4 === 1 ? 'WARN' : 
                         i % 4 === 2 ? 'INFO' : 
                         'DEBUG'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">2024-01-20 10:30:45</span>
                      <span className="font-medium">service-name</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto"
                      >
                        Expand
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Log message preview. Click to expand for full context...
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>

              {/* Load More Button */}
              <div className="flex justify-center p-4">
                <Button variant="outline">
                  Load More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
