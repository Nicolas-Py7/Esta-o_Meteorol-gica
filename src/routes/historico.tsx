import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Search, Calendar } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { generateHistory } from "@/lib/mockData";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico · MeteoStation" },
      { name: "description", content: "Histórico de medições da estação meteorológica." },
    ],
  }),
  component: History,
});

function History() {
  const all = useMemo(() => generateHistory(60), []);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");

  const filtered = all.filter((r) => {
    if (from && r.date < from) return false;
    if (to && r.date > to) return false;
    if (q && !r.date.includes(q)) return false;
    return true;
  });

  const exportCsv = () => {
    const head = "data,temperatura,umidade,solo,pressao,luz,chuva\n";
    const body = filtered
      .map((r) => `${r.date},${r.temperature},${r.humidity},${r.soilHumidity},${r.pressure},${r.light},${r.rain}`)
      .join("\n");
    const blob = new Blob([head + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "historico-meteo.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout title="Histórico de medições" subtitle="Consulta detalhada de leituras anteriores">
      <div className="glass mb-4 grid gap-3 rounded-2xl p-4 md:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar por data (YYYY-MM)..." className="pl-9 bg-input/40" />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-input/40" />
          <span className="text-xs text-muted-foreground">até</span>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="bg-input/40" />
        </div>
        <Button variant="secondary" onClick={() => { setFrom(""); setTo(""); setQ(""); }}>Limpar</Button>
        <Button onClick={exportCsv} className="gap-2">
          <Download className="h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      <div className="glass mb-6 rounded-2xl p-5">
        <h3 className="mb-4 text-sm font-semibold">Tendência histórica · temperatura</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={[...filtered].reverse()}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "oklch(0.2 0.04 250 / 0.95)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
            <Line type="monotone" dataKey="temperature" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="humidity" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="`max-h-[520px]` overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card/80 backdrop-blur">
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Temp (°C)</TableHead>
                <TableHead>Umid. (%)</TableHead>
                <TableHead>Solo (%)</TableHead>
                <TableHead>Pressão (hPa)</TableHead>
                <TableHead>Luz (lux)</TableHead>
                <TableHead>Chuva (mm)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.date}>
                  <TableCell className="font-medium">{r.date}</TableCell>
                  <TableCell>{r.temperature}</TableCell>
                  <TableCell>{r.humidity}</TableCell>
                  <TableCell>{r.soilHumidity}</TableCell>
                  <TableCell>{r.pressure}</TableCell>
                  <TableCell>{r.light}</TableCell>
                  <TableCell>{r.rain}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
