'use client';

import { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Lock, Eye, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const { role } = useRole();
  const isAdmin = role === 'admin';
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue={isAdmin ? 'admin' : 'viewer'} className="w-full">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-1'}`}>
          {isAdmin && (
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Admin Controls
            </TabsTrigger>
          )}
          <TabsTrigger value="viewer" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Viewer Settings
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              General
            </TabsTrigger>
          )}
        </TabsList>

        {isAdmin && (
          <TabsContent value="admin" className="space-y-6">
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Lock className="h-5 w-5" />
                  Admin Access Control
                </CardTitle>
                <CardDescription>
                  Administrative settings are restricted to admin users only.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium mb-2">User Management</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Add, edit, or remove users from the system.
                    </p>
                    <Button variant="outline" disabled>
                      Manage Users (Coming Soon)
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div>
                    <h3 className="font-medium mb-2">Data Management</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Export, backup, or reset system data.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" disabled>
                        Export Data (Coming Soon)
                      </Button>
                      <Button variant="destructive" disabled>
                        Reset Data (Coming Soon)
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div>
                    <h3 className="font-medium mb-2">System Settings</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Configure system-wide settings and preferences.
                    </p>
                    <Button variant="outline" disabled>
                      Configure System (Coming Soon)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="viewer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Viewer Display Settings
              </CardTitle>
              <CardDescription>
                Customize how you view information in the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium mb-2">Theme</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose your preferred display theme.
                  </p>
                  <select 
                    value={theme} 
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="auto">System Default</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div>
                  <h3 className="font-medium mb-2">Notifications</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Receive notifications for important updates.
                  </p>
                  <Button 
                    variant={notifications ? 'default' : 'outline'}
                    onClick={() => setNotifications(!notifications)}
                  >
                    {notifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div>
                  <h3 className="font-medium mb-2">Data Display</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Configure how financial data is displayed.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" disabled>
                      Currency Format (Coming Soon)
                    </Button>
                    <Button variant="outline" disabled>
                      Date Format (Coming Soon)
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Application-wide general settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium mb-2">Application Name</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      The name of your financial tracking application.
                    </p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        defaultValue="Finsight"
                        className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm"
                        disabled
                        placeholder="App name"
                      />
                      <Button disabled>Update</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div>
                    <h3 className="font-medium mb-2">About</h3>
                    <p className="text-sm text-muted-foreground">
                      Finsight v1.0.0 - Financial Intelligence Dashboard
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {!isAdmin && (
          <div className="mt-6 p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-900 dark:text-amber-200">Limited Access</h3>
                <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                  As a viewer, you have access to limited settings. Admin features are not available for your account.
                </p>
              </div>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
}
