import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Settings, Shield, Globe, Bell, Database, Mail } from "lucide-react";

export function AdminSettings() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-muted-foreground mt-1">R-Learn platform configuration and information</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-blue-500" />Authentication</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Allowed Email Domain</p>
                <p className="text-xs text-muted-foreground">Only users with this domain can register</p>
              </div>
              <Badge variant="outline" className="font-mono">@redihire.com</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Admin Approval Required</p>
                <p className="text-xs text-muted-foreground">New users must be approved before accessing the platform</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Auth Provider</p>
                <p className="text-xs text-muted-foreground">Authentication backend</p>
              </div>
              <Badge variant="outline">Supabase Auth</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-green-500" />Platform</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Platform Name</p>
                <p className="text-xs text-muted-foreground">Displayed across the application</p>
              </div>
              <Badge variant="outline">R-Learn</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Technology Tracks</p>
                <p className="text-xs text-muted-foreground">Available learning paths</p>
              </div>
              <Badge variant="outline">14 Tracks</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">User Roles</p>
                <p className="text-xs text-muted-foreground">Supported access levels</p>
              </div>
              <div className="flex gap-1">
                <Badge className="bg-gray-100 text-gray-700 text-xs">Employee</Badge>
                <Badge className="bg-blue-100 text-blue-700 text-xs">Mentor</Badge>
                <Badge className="bg-purple-100 text-purple-700 text-xs">Admin</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Database className="w-5 h-5 text-orange-500" />Database</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Database Provider</p>
                <p className="text-xs text-muted-foreground">Backend data store</p>
              </div>
              <Badge variant="outline">Supabase (PostgreSQL)</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Project Reference</p>
                <p className="text-xs text-muted-foreground">Supabase project ID</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">rdnhbreuusnfvwmrecor</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Real-time</p>
                <p className="text-xs text-muted-foreground">Live data synchronization</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-purple-500" />Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">New User Registration Alerts</p>
                <p className="text-xs text-muted-foreground">Admins are notified of new pending users</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Email Confirmation</p>
                <p className="text-xs text-muted-foreground">Configure in Supabase Dashboard → Authentication → Settings</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5" /> Supabase Dashboard
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
