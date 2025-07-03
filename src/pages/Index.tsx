
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  Clock, 
  FileText, 
  Settings, 
  Bell,
  BellOff 
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'success' | 'error' | 'info';
  message: string;
}

const Index = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [fiscalDayOpen, setFiscalDayOpen] = useState(false);
  const [watcherRunning, setWatcherRunning] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date(),
      type: 'info',
      message: 'System started successfully'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 5000),
      type: 'success',
      message: 'Invoice INV-001 processed and sent to fiscal backend'
    }
  ]);

  const addLog = (type: LogEntry['type'], message: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      message
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  const handleOpenDay = () => {
    if (!fiscalDayOpen) {
      setFiscalDayOpen(true);
      addLog('success', 'Fiscal day opened');
    }
  };

  const handleCloseDay = () => {
    if (fiscalDayOpen) {
      setFiscalDayOpen(false);
      addLog('success', 'Fiscal day closed');
    }
  };

  const handleForceSync = () => {
    addLog('info', 'Force sync initiated - checking for failed receipts');
    // Simulate some processing
    setTimeout(() => {
      addLog('success', 'Force sync completed - 2 receipts retried');
    }, 2000);
  };

  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-500" : "bg-red-500";
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fiscal Sync Guardian</h1>
            <p className="text-gray-600 mt-1">POS Fiscalization Bridge</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Backend Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(isOnline)}`}></div>
                <span className="font-medium">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {isOnline ? 'Connected to fiscal backend' : 'Connection failed'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Fiscal Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge variant={fiscalDayOpen ? "default" : "secondary"}>
                  {fiscalDayOpen ? 'Open' : 'Closed'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {fiscalDayOpen ? 'Ready to process invoices' : 'Day must be opened first'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                File Watcher
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(watcherRunning)}`}></div>
                <span className="font-medium">{watcherRunning ? 'Running' : 'Stopped'}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Monitoring: C:\POS\Invoices\
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleOpenDay}
                disabled={fiscalDayOpen}
                variant={fiscalDayOpen ? "outline" : "default"}
              >
                Open Fiscal Day
              </Button>
              
              <Button 
                onClick={handleCloseDay}
                disabled={!fiscalDayOpen}
                variant={!fiscalDayOpen ? "outline" : "destructive"}
              >
                Close Fiscal Day
              </Button>
              
              <Separator orientation="vertical" className="h-8" />
              
              <Button 
                onClick={handleForceSync}
                variant="outline"
              >
                Force Sync
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status Alert */}
        {!isOnline && (
          <Alert>
            <BellOff className="h-4 w-4" />
            <AlertDescription>
              System is running in offline mode. Invoices will be queued and sent when connection is restored.
            </AlertDescription>
          </Alert>
        )}

        {/* Activity Log Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <span className="text-lg">{getLogIcon(log.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{log.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {log.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Index;
