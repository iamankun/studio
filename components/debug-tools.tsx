"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthorizedComponent } from "@/components/authorized-component";
import { logger } from "@/lib/logger";
import { multiDB } from "@/lib/database-api-service";

export function DebugTools() {
  const [result, setResult] = useState<string>("");

  const generateTestLogs = () => {
    logger.debug("Kiểm tra sửa lỗi", { testData: { value: 123 } });
    logger.info("Kiểm tra thông báo thông tin", { testData: { value: 456 } });
    logger.warn("Kiểm tra thông báo cảnh báo", { testData: { value: 789 } });
    logger.error("Kiểm tra thông báo lỗi", {
      error: new Error("Kiểm tra lỗi"),
    });

    setResult("Tạo 4 nhật ký thử nghiệm");
  };

  const checkDatabase = async () => {
    const connection = await multiDB.getStatus();
    setResult(JSON.stringify(connection, null, 2));

    if (!connection.api) {
      logger.warn("Kiểm tra kết nối dữ liệu thất bại", {
        component: "Công cụ gỡ lỗi",
        action: "Kiểm tra dữ liệu",
        data: "API kết nối thất bại",
      });
    } else {
      logger.info("Kiểm tra kết nối cơ sở dữ liệu thành công", {
        component: "Công cụ gỡ lỗi",
        action: "Kiểm tra dữ liệu",
      });
    }
  };

  const clearAllData = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      logger.info("Đã xóa tất cả dữ liệu dữ liệu tại gốc", {
        component: "Công cụ gỡ lỗi",
        action: "Xóa tất cả dữ liệu",
      });
      setResult("Đã xóa tất cả dữ liệu tại gốc");
    }
  };

  return (
    <AuthorizedComponent
      requirePermission="debugTools"
      fallbackMessage="Các công cụ gỡ lỗi chỉ dành cho quản trị và quản lí nhãn."
    >
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Công cụ gỡ lỗi</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="logs">
            <TabsList className="mb-4">
              <TabsTrigger value="logs">Nhật ký</TabsTrigger>
              <TabsTrigger value="db">Cơ sở dữ liệu</TabsTrigger>
              <TabsTrigger value="storage">Lưu trữ</TabsTrigger>
            </TabsList>

            <TabsContent value="logs">
              <div className="space-y-4">
                <Button onClick={generateTestLogs}>
                  Tạo nhật ký thử nghiệm
                </Button>
                <Button variant="outline" onClick={() => logger.clearLogs()}>
                  Xóa nhật ký
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="db">
              <div className="space-y-4">
                <Button onClick={checkDatabase}>
                  Kiểm tra kết nối cơ sở dữ liệu
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="storage">
              <div className="space-y-4">
                <Button variant="destructive" onClick={clearAllData}>
                  Xóa tất cả dữ liệu
                </Button>
                <p className="text-xs text-gray-500">
                  Cảnh báo: Điều này sẽ xóa tất cả dữ liệu gốc bao gồm nhật ký
                  và các bản gửi
                </p>
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
  );
}
