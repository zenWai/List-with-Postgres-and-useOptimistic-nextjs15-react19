"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type DelayEnabledSwitchProps = {
  delayEnabled: boolean;
  onDelayEnabledChange: () => void;
};

export function DelayEnabledSwitch({
  delayEnabled,
  onDelayEnabledChange,
}: DelayEnabledSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="delayEnabled"
        checked={delayEnabled}
        onCheckedChange={onDelayEnabledChange}
      />
      <Label htmlFor="delayEnabled">Delay Enabled?</Label>
    </div>
  );
}
