import { Routes, Route, Link } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import CodesPage from './pages/CodesPage'
import CodeDetailPage from './pages/CodeDetailPage'
import AppendixDetailPage from './pages/AppendixDetailPage'
import EffectivePage from './pages/EffectivePage'
import RevisionsPage from './pages/RevisionsPage'
import AskAIPage from './pages/AskAIPage'
import AssistiveDevicesPage from './pages/AssistiveDevicesPage'
import TopicsPage from './pages/TopicsPage'
import TopicDetailPage from './pages/TopicDetailPage'

function NotFound() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
      找不到頁面。
      <div className="mt-2">
        <Link to="/" className="text-brand-600 hover:underline">
          返回首頁
        </Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:n" element={<ArticleDetailPage />} />
        <Route path="/codes" element={<CodesPage />} />
        <Route path="/codes/:code" element={<CodeDetailPage />} />
        <Route path="/appendices/:id" element={<AppendixDetailPage />} />
        <Route path="/effective" element={<EffectivePage />} />
        <Route path="/revisions" element={<RevisionsPage />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/topics/:topicId" element={<TopicDetailPage />} />
        <Route path="/assistive-devices" element={<AssistiveDevicesPage />} />
        <Route path="/ask-ai" element={<AskAIPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
