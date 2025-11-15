import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getLabTest } from "@/services/labtestApi";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  ArrowLeft,
  AlertCircle,
  FlaskConical,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  FileText
} from "lucide-react";

const LabTestDetails = () => {
  const { labtestid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { labTest, loading, error } = useSelector(
    (state) => state.labtest
  );

  useEffect(() => {
    dispatch(getLabTest(labtestid));
  }, [dispatch, labtestid]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      ordered: { variant: "secondary", icon: Clock, color: "text-yellow-600 bg-yellow-100" },
      processing: { variant: "default", icon: Clock, color: "text-blue-600 bg-blue-100" },
      completed: { variant: "outline", icon: CheckCircle2, color: "text-green-600 bg-green-100" },
    };

    const config = statusConfig[status] || statusConfig.ordered;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading lab test details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error?.message || "Failed to load lab test"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!labTest) return null;

  const { 
    tests,
    overall_status,
    report_date,
    verified_by,
    verified_at,
    createdAt
  } = labTest;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/labtests")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Lab Tests
        </Button>

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2 flex items-center gap-2">
                  <FlaskConical className="w-8 h-8 text-blue-600" />
                  Lab Test Details
                </CardTitle>
                <p className="text-gray-500">
                  View your laboratory test results and reports
                </p>
              </div>
              {getStatusBadge(overall_status)}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Test Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Test Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {report_date && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Report Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(report_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                {verified_by && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-600 mb-1">Verified</p>
                      <p className="font-semibold text-gray-900">
                        {verified_at ? new Date(verified_at).toLocaleDateString() : "Yes"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Test Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-blue-600" />
                Test Results ({tests?.length || 0})
              </h3>
              <div className="space-y-4">
                {tests && tests.length > 0 ? (
                  tests.map((test, index) => (
                    <Card key={index} className="bg-gray-50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FlaskConical className="w-5 h-5 text-blue-600" />
                            {test.test_name}
                          </CardTitle>
                          {getStatusBadge(test.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {test.parameters && test.parameters.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700">Parameters:</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left p-2">Parameter</th>
                                    <th className="text-left p-2">Value</th>
                                    <th className="text-left p-2">Unit</th>
                                    <th className="text-left p-2">Reference</th>
                                    <th className="text-left p-2">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {test.parameters.map((param, paramIndex) => (
                                    <tr key={paramIndex} className="border-b">
                                      <td className="p-2">{param.name}</td>
                                      <td className="p-2 font-medium">{param.value}</td>
                                      <td className="p-2">{param.unit}</td>
                                      <td className="p-2 text-gray-600">{param.reference_range}</td>
                                      <td className="p-2">
                                        <Badge 
                                          variant={
                                            param.status === "Normal" ? "outline" : 
                                            param.status === "High" || param.status === "Low" ? "destructive" : 
                                            "secondary"
                                          }
                                          className="text-xs"
                                        >
                                          {param.status}
                                        </Badge>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        {test.result_summary && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Summary:</p>
                            <p className="text-gray-900">{test.result_summary}</p>
                          </div>
                        )}
                        {test.remarks && (
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Remarks:</p>
                            <p className="text-gray-900">{test.remarks}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>No test results available</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabTestDetails;

