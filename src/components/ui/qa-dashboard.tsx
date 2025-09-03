import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { runQualityAssurance, type QAReport } from '@/utils/testing-helpers';
import { CheckCircle, AlertTriangle, XCircle, Play } from 'lucide-react';

export function QADashboard() {
  const [report, setReport] = useState<QAReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    // Simulate async testing
    setTimeout(() => {
      const newReport = runQualityAssurance();
      setReport(newReport);
      setIsRunning(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'fail': return <XCircle className="w-4 h-4 text-error" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quality Assurance Dashboard</h1>
        <Button onClick={runTests} disabled={isRunning}>
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run QA Tests'}
        </Button>
      </div>

      {report && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Overall Score
                <span className={`text-3xl font-bold ${getScoreColor(report.overallScore)}`}>
                  {report.overallScore}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-sm">
                {['functionality', 'accessibility', 'performance', 'ux'].map(category => {
                  const categoryTests = report.results.filter(r => r.category === category);
                  const passed = categoryTests.filter(r => r.status === 'pass').length;
                  const score = Math.round((passed / categoryTests.length) * 100);
                  
                  return (
                    <div key={category} className="text-center">
                      <div className="font-semibold capitalize">{category}</div>
                      <div className={getScoreColor(score)}>{score}%</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {report.results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.test}</span>
                      <Badge variant="outline" className="text-xs">
                        {result.category}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{result.message}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}