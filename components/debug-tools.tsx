"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthorizedComponent } from "@/components/authorized-component"
import { logger } from "@/lib/logger"
import { multiDB } from "@/lib/database-api-service"

export function DebugTools() {
    const [result, setResult] = useState<string>("")

    const generateTestLogs = () => {
        logger.debug('Test debug message', { testData: { value: 123 } })
        logger.info('Test info message', { testData: { value: 456 } })
        logger.warn('Test warning message', { testData: { value: 789 } })
        logger.error('Test error message', { error: new Error('Test error') })

        setResult("Generated 4 test log entries")
    }

    const checkDatabase = async () => {
        const connection = await multiDB.getStatus()
        setResult(JSON.stringify(connection, null, 2))

        if (!connection.api) {
            logger.warn('Database connection check failed', {
                component: 'DebugTools',
                action: 'checkDatabase',
                data: 'API connection failed'
            })
        } else {
            logger.info('Database connection check successful', {
                component: 'DebugTools',
                action: 'checkDatabase'
            })
        }
    }

    const clearAllData = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear()
            logger.info('Cleared all localStorage data', {
                component: 'DebugTools',
                action: 'clearAllData'
            })
            setResult("All localStorage data cleared")
        }
    }

    return (
        <AuthorizedComponent
            requirePermission="debugTools"
            fallbackMessage="Debug tools are only available for Label Managers."
        >
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Debug Tools</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="logs">
                        <TabsList className="mb-4">
                            <TabsTrigger value="logs">Logs</TabsTrigger>
                            <TabsTrigger value="db">Database</TabsTrigger>
                            <TabsTrigger value="storage">Storage</TabsTrigger>
                        </TabsList>

                        <TabsContent value="logs">
                            <div className="space-y-4">
                                <Button onClick={generateTestLogs}>Generate Test Logs</Button>
                                <Button variant="outline" onClick={() => logger.clearLogs()}>Clear Logs</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="db">
                            <div className="space-y-4">
                                <Button onClick={checkDatabase}>Check Database Connection</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="storage">
                            <div className="space-y-4">
                                <Button variant="destructive" onClick={clearAllData}>Clear All Data</Button>
                                <p className="text-xs text-gray-500">Warning: This will clear all localStorage data including logs and submissions</p>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {result && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-md">
                            <pre className="text-xs overflow-auto max-h-40">{result}</pre>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthorizedComponent>
    )
}
