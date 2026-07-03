import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download, Star, BarChart3, MessageSquare, Check, MoreVertical } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { feedbackSessions } from '../constants/data';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}/5</span>
    </div>
  );
}

export default function Feedback() {
  const [selected, setSelected] = useState(feedbackSessions[0]);
  const detail = selected.selected !== undefined ? selected : feedbackSessions[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-gray-400 mb-1">Reports &gt; Feedback</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Performance Feedback</h1>
          <p className="text-gray-500 mt-1">Review and manage feedback sessions from mentors to track intern progress.</p>
        </motion.div>
        <div className="flex gap-3">
          <Button variant="outline" icon={Filter} size="sm">Filter</Button>
          <Button variant="outline" icon={Download} size="sm">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Sessions</h2>
            <Badge variant="primary">24 Total</Badge>
          </div>
          {feedbackSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setSelected(session)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selected.id === session.id
                  ? 'border-primary-500 bg-primary-50/50 border-l-4'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Avatar src={session.avatar} name={session.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{session.name}</p>
                  <p className="text-xs text-gray-400">{session.role}</p>
                </div>
                <span className="text-xs text-gray-400">{session.time}</span>
              </div>
              <StarRating rating={session.rating} />
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{session.preview}</p>
              <div className="flex gap-2 mt-2">
                {session.tags.map((tag) => (
                  <Badge key={tag} variant="primary" className="text-[10px]">{tag}</Badge>
                ))}
              </div>
            </button>
          ))}
        </div>

        <Card className="lg:col-span-2">
          {detail.metrics ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <Avatar src={detail.avatar} name={detail.name} size="lg" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{detail.title}</h2>
                    <p className="text-sm text-gray-500">{detail.name} &bull; {detail.role}</p>
                    <p className="text-xs text-gray-400">{detail.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Reply</Button>
                  <Button variant="purple" size="sm">Acknowledge</Button>
                  <button aria-label="More options"><MoreVertical className="w-5 h-5 text-gray-400" /></button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="default">{detail.team}</Badge>
                {detail.acknowledged && (
                  <Badge variant="primary" className="flex items-center gap-1">
                    <Check className="w-3 h-3" /> Acknowledged
                  </Badge>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">Performance Metrics</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {detail.metrics.map((metric) => (
                    <div key={metric.label} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                        <span className="text-lg font-bold text-gray-900">{metric.score}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full ${metric.color}`}
                          style={{ width: `${(metric.score / 5) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">{metric.status}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">Mentor Comments</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Overall Performance</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{detail.comments.overall}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Team Collaboration</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{detail.comments.collaboration}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-12">Select a session to view details</p>
          )}
        </Card>
      </div>
    </div>
  );
}
