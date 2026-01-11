import ELDLog from "./components/ELDLog";

{daily_logs.map(log => (
  <ELDLog key={log.day} log={log} />
))}
