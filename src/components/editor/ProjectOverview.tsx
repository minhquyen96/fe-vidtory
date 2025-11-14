import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProjectOverviewProps {
  data: {
    targetAudience: string
    typeOfAds: string
    vibe: string
    goals: string
    channels: string
  }
  onChange: (data: Partial<ProjectOverviewProps['data']>) => void
}

export function ProjectOverview({ data, onChange }: ProjectOverviewProps) {
  return (
    <Card className="w-80 bg-white border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Project overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Target audience</label>
          <Input
            value={data.targetAudience}
            onChange={(e) => onChange({ targetAudience: e.target.value })}
            placeholder="John"
            className="h-8 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Type of ads</label>
          <Select
            value={data.typeOfAds || ''}
            onValueChange={(value) => onChange({ typeOfAds: value })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="display">Display Ads</SelectItem>
              <SelectItem value="video">Video Ads</SelectItem>
              <SelectItem value="social">Social Media Ads</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Vibe</label>
          <Textarea
            value={data.vibe}
            onChange={(e) => onChange({ vibe: e.target.value })}
            placeholder="The vibe is relaxed and inviting, perfect for unwinding after a long day."
            className="min-h-[60px] text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Goals</label>
          <Textarea
            value={data.goals}
            onChange={(e) => onChange({ goals: e.target.value })}
            placeholder="Increase brand awareness."
            className="min-h-[60px] text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Channels</label>
          <Textarea
            value={data.channels}
            onChange={(e) => onChange({ channels: e.target.value })}
            placeholder="Social Media."
            className="min-h-[60px] text-sm"
          />
        </div>
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add field
        </Button>
      </CardContent>
    </Card>
  )
}

