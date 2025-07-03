
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Activity, 
  Clock, 
  FileText, 
  Settings, 
  CheckCircle,
  XCircle,
  Info,
  BellOff,
  Send,
  FileCheck,
  FileX
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface Invoice {
  id: string;
  number: string;
  amount: number;
  date: Date;
  status: 'signed' | 'sent' | 'excluded';
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

  const [invoices] = useState<Invoice[]>([
    { id: '1', number: 'INV-001', amount: 1250.00, date: new Date(), status: 'signed' },
    { id: '2', number: 'INV-002', amount: 850.50, date: new Date(Date.now() - 86400000), status: 'sent' },
    { id: '3', number: 'INV-003', amount: 2100.75, date: new Date(Date.now() - 172800000), status: 'excluded' },
    { id: '4', number: 'INV-004', amount: 675.25, date: new Date(Date.now() - 259200000), status: 'signed' },
  ]);

  const addLog = (type: LogEntry['type'], message: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      message
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
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
    setTimeout(() => {
      addLog('success', 'Force sync completed - 2 receipts retried');
    }, 2000);
  };

  const handleGetStatus = () => {
    addLog('info', 'Getting system status...');
    setTimeout(() => {
      addLog('success', 'System status retrieved successfully');
    }, 1500);
  };

  const handleGetConfig = () => {
    addLog('info', 'Retrieving configuration...');
    setTimeout(() => {
      addLog('success', 'Configuration loaded successfully');
    }, 1500);
  };

  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-500" : "bg-red-500";
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getInvoicesByStatus = (status: 'signed' | 'sent' | 'excluded') => {
    return invoices.filter(invoice => invoice.status === status);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'signed':
        return 'default';
      case 'sent':
        return 'secondary';
      case 'excluded':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <FileCheck className="h-4 w-4" />;
      case 'sent':
        return <Send className="h-4 w-4" />;
      case 'excluded':
        return <FileX className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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
                Operating Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(isOnline)}`}></div>
                <span className="font-medium">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
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

        {/* Operations Section */}
        <Card>
          <CardHeader>
            <CardTitle>Operations</CardTitle>
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

              <Button 
                onClick={handleGetStatus}
                variant="outline"
              >
                Get Status
              </Button>

              <Button 
                onClick={handleGetConfig}
                variant="outline"
              >
                Get Config
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Section */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signed" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="signed" className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  Signed ({getInvoicesByStatus('signed').length})
                </TabsTrigger>
                <TabsTrigger value="sent" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Sent ({getInvoicesByStatus('sent').length})
                </TabsTrigger>
                <TabsTrigger value="excluded" className="flex items-center gap-2">
                  <FileX className="h-4 w-4" />
                  Excluded ({getInvoicesByStatus('excluded').length})
                </TabsTrigger>
              </TabsList>
              
              {(['signed', 'sent', 'excluded'] as const).map((status) => (
                <TabsContent key={status} value={status}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getInvoicesByStatus(status).map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.number}</TableCell>
                          <TableCell>{invoice.date.toLocaleDateString()}</TableCell>
                          <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(invoice.status)} className="flex items-center gap-1 w-fit">
                              {getStatusIcon(invoice.status)}
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
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
              <Activity className="h-4 w-4 mr-2" />
              Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  {getLogIcon(log.type)}
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
