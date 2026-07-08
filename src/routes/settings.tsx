import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Sun, Moon, Monitor, 
  RefreshCw, ShieldCheck, Globe 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Settings: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [currency, setCurrency] = useState('USD');
  const [currencies, setCurrencies] = useState<any[]>([]);

  useEffect(() => {
    // Load initial settings theme
    const savedTheme = window.localStorage.getItem('theme') || 'system';
    setTheme(savedTheme as any);

    // Fetch master currencies
    supabase.from('currencies').select('*').then(({ data }) => {
      if (data) setCurrencies(data);
    });

    // Fetch user settings base currency
    supabase.from('user_settings').select('*').maybeSingle().then(({ data }) => {
      if (data && data.base_currency_id) {
        setCurrency(data.base_currency_id);
      }
    });
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    window.localStorage.setItem('theme', newTheme);
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
  };

  const handleCurrencyChange = async (newCurr: string) => {
    setCurrency(newCurr);
    try {
      await supabase.from('user_settings').upsert({ base_currency_id: newCurr }, { onConflict: 'created_by' });
    } catch (err) {
      console.error('Error updating base currency:', err);
    }
  };

  const handleResetData = () => {
    if (!confirm('This will wipe all custom entries and restore the demo logs. Continue?')) return;
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title */}
      <div className="select-none">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-xs text-muted-foreground">Adjust layout preferences, default currencies, and sandbox resets.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        
        {/* Color Theme Preference */}
        <Card>
          <CardHeader className="pb-3 select-none">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Sun className="h-4.5 w-4.5 text-primary" />
              Theme Preference
            </CardTitle>
            <CardDescription className="text-xs">Select how you want the application to look</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            {[
              { id: 'light', label: 'Light Mode', icon: Sun },
              { id: 'dark', label: 'Dark Mode', icon: Moon },
              { id: 'system', label: 'System Default', icon: Monitor }
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleThemeChange(item.id as any)}
                  className={`
                    flex-1 py-3 px-4 rounded-xl border flex items-center justify-between font-bold text-xs select-none transition-all cursor-pointer
                    ${isSelected 
                      ? 'border-primary bg-primary/5 text-primary shadow-xs' 
                      : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4.5 w-4.5" />
                    {item.label}
                  </span>
                  {isSelected && <ShieldCheck className="h-4.5 w-4.5 text-primary" />}
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Currency Card */}
        <Card>
          <CardHeader className="pb-3 select-none">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <Globe className="h-4.5 w-4.5 text-primary" />
              Currency Settings
            </CardTitle>
            <CardDescription className="text-xs">Adjust the default monetary symbols used in dashboards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-muted-foreground select-none">Base Currency</label>
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full max-w-xs px-3 py-2 rounded-lg border border-border bg-background text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/45"
              >
                {currencies.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Database resets */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3 select-none">
            <CardTitle className="text-sm text-destructive flex items-center gap-1.5">
              <RefreshCw className="h-4.5 w-4.5 text-destructive" />
              Reset Helper
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground/80">Wipes local modifications and reinstates standard demo logs</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleResetData}
              variant="danger"
              size="sm"
              className="text-xs py-2 cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="h-4 w-4" />
              Reset My Data
            </Button>
          </CardContent>
        </Card>

      </div>

    </div>
  );
};
