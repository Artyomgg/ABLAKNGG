import { useEffect, useState } from 'react'
import './Admin.css'

const ADMIN_PASSWORD = 'abla'

const REPO_OWNER = 'Artyomgg'
const REPO_NAME = 'ABLAKNEWS'
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN

function Admin() {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [password, setPassword] = useState('')
	const [activeTab, setActiveTab] = useState('news')
	const [loading, setLoading] = useState(true)

	// НОВОСТИ
	const [news, setNews] = useState([])
	const [newsForm, setNewsForm] = useState({
		title: '',
		description: '',
		date: '',
		image: '',
		link: '',
	})

	// ФОТО
	const [photos, setPhotos] = useState([])
	const [newPhotoUrl, setNewPhotoUrl] = useState('')

	// ТРЕКИ
	const [tracks, setTracks] = useState([])
	const [trackForm, setTrackForm] = useState({
		title: '',
		audio: '',
		duration: '',
		cover: '',
	})

	// ========== ЗАГРУЗКА НОВОСТЕЙ ==========
	const loadNews = async () => {
		try {
			const res = await fetch(
				`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/news.json`,
			)
			const data = await res.json()
			const content = JSON.parse(atob(data.content))
			setNews(content)
		} catch (error) {
			console.error('Ошибка загрузки новостей:', error)
			setNews([])
		}
	}

	// ========== ЗАГРУЗКА ФОТО ==========
	const loadPhotos = async () => {
		try {
			const res = await fetch(
				`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/photos.json`,
			)
			const data = await res.json()
			const content = JSON.parse(atob(data.content))
			setPhotos(content)
		} catch (error) {
			console.error('Ошибка загрузки фото:', error)
			setPhotos([])
		}
	}

	// ========== ЗАГРУЗКА ТРЕКОВ ==========
	const loadTracks = async () => {
		try {
			const res = await fetch(
				`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/tracks.json`,
			)
			const data = await res.json()
			const content = JSON.parse(atob(data.content))
			setTracks(content)
		} catch (error) {
			console.error('Ошибка загрузки треков:', error)
			setTracks([])
		}
	}

	// ========== СОХРАНЕНИЕ ==========
	const saveToGitHub = async (filename, data) => {
		try {
			const res = await fetch(
				`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`,
			)
			const fileData = await res.json()
			const sha = fileData.sha

			const body = {
				message: `Обновление ${filename} ${new Date().toLocaleString()}`,
				content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
				sha: sha,
			}

			await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`, {
				method: 'PUT',
				headers: {
					Authorization: `token ${GITHUB_TOKEN}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})
		} catch (error) {
			console.error('Ошибка сохранения:', error)
			throw error
		}
	}

	// ========== ЗАГРУЗКА ПРИ СТАРТЕ ==========
	useEffect(() => {
		loadNews()
		loadPhotos()
		loadTracks()
	}, [])

	// ========== ВХОД ==========
	const handleLogin = e => {
		e.preventDefault()
		if (password === ADMIN_PASSWORD) {
			setIsAuthenticated(true)
		} else {
			alert('Неверный пароль')
		}
	}

	// ========== НОВОСТИ: ДОБАВИТЬ ==========
	const handleAddNews = async e => {
		e.preventDefault()
		const newItem = { id: Date.now(), ...newsForm }
		const updated = [newItem, ...news]
		setNews(updated)
		await saveToGitHub('news.json', updated)
		setNewsForm({ title: '', description: '', date: '', image: '', link: '' })
		alert('Новость добавлена!')
	}

	// ========== НОВОСТИ: УДАЛИТЬ ==========
	const handleDeleteNews = async id => {
		if (confirm('Удалить новость?')) {
			const updated = news.filter(item => item.id !== id)
			setNews(updated)
			await saveToGitHub('news.json', updated)
		}
	}

	// ========== ФОТО: ДОБАВИТЬ ==========
	const handleAddPhoto = async e => {
		e.preventDefault()
		if (!newPhotoUrl.trim()) return alert('Вставь ссылку на фото')
		const updated = [...photos, newPhotoUrl.trim()]
		setPhotos(updated)
		await saveToGitHub('photos.json', updated)
		setNewPhotoUrl('')
		alert('Фото добавлено!')
	}

	// ========== ФОТО: УДАЛИТЬ ==========
	const handleDeletePhoto = async index => {
		if (confirm('Удалить фото?')) {
			const updated = photos.filter((_, i) => i !== index)
			setPhotos(updated)
			await saveToGitHub('photos.json', updated)
		}
	}

	// ========== ТРЕКИ: ДОБАВИТЬ ==========
	const handleAddTrack = async e => {
		e.preventDefault()
		const newItem = {
			id: Date.now(),
			...trackForm,
		}
		const updated = [...tracks, newItem]
		setTracks(updated)
		await saveToGitHub('tracks.json', updated)
		setTrackForm({ title: '', audio: '', duration: '', cover: '' })
		alert('Трек добавлен!')
	}

	// ========== ТРЕКИ: УДАЛИТЬ ==========
	const handleDeleteTrack = async id => {
		if (confirm('Удалить трек?')) {
			const updated = tracks.filter(item => item.id !== id)
			setTracks(updated)
			await saveToGitHub('tracks.json', updated)
		}
	}

	if (!isAuthenticated) {
		return (
			<div className='admin-login'>
				<div className='admin-login-box'>
					<h2>Вход в админку</h2>
					<form onSubmit={handleLogin}>
						<input
							type='password'
							placeholder='Введите пароль'
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<button type='submit'>Войти</button>
					</form>
				</div>
			</div>
		)
	}

	return (
		<div className='admin-panel'>
			<div className='admin-container'>
				<h1>Админка ABLAK NGG</h1>
				<p>Управляй новостями, фото и треками</p>

				<div className='admin-tabs'>
					<button
						className={activeTab === 'news' ? 'active' : ''}
						onClick={() => setActiveTab('news')}
					>
						📰 Новости
					</button>
					<button
						className={activeTab === 'photos' ? 'active' : ''}
						onClick={() => setActiveTab('photos')}
					>
						🖼️ Фото
					</button>
					<button
						className={activeTab === 'tracks' ? 'active' : ''}
						onClick={() => setActiveTab('tracks')}
					>
						🎵 Треки
					</button>
				</div>

				{/* ============ НОВОСТИ ============ */}
				{activeTab === 'news' && (
					<>
						<form className='admin-form' onSubmit={handleAddNews}>
							<input
								type='text'
								placeholder='Заголовок'
								value={newsForm.title}
								onChange={e => setNewsForm({ ...newsForm, title: e.target.value })}
								required
							/>
							<textarea
								placeholder='Описание'
								value={newsForm.description}
								onChange={e => setNewsForm({ ...newsForm, description: e.target.value })}
								required
							/>
							<input
								type='date'
								value={newsForm.date}
								onChange={e => setNewsForm({ ...newsForm, date: e.target.value })}
								required
							/>
							<input
								type='text'
								placeholder='Ссылка на картинку (ibb.co)'
								value={newsForm.image}
								onChange={e => setNewsForm({ ...newsForm, image: e.target.value })}
							/>
							<input
								type='text'
								placeholder='Ссылка (например /music или https://...)'
								value={newsForm.link}
								onChange={e => setNewsForm({ ...newsForm, link: e.target.value })}
							/>
							<button type='submit' className='btn-primary'>
								Добавить новость
							</button>
						</form>

						<div className='admin-news-list'>
							<h3>Все новости ({news.length})</h3>
							{news.length === 0 && <p>Новостей пока нет</p>}
							{news.map(item => (
								<div className='admin-news-item' key={item.id}>
									<div className='admin-news-info'>
										<strong>{item.title}</strong>
										<span>{item.date}</span>
									</div>
									<button className='admin-delete-btn' onClick={() => handleDeleteNews(item.id)}>
										Удалить
									</button>
								</div>
							))}
						</div>
					</>
				)}

				{/* ============ ФОТО ============ */}
				{activeTab === 'photos' && (
					<>
						<form className='admin-form' onSubmit={handleAddPhoto}>
							<input
								type='text'
								placeholder='Ссылка на фото (ibb.co)'
								value={newPhotoUrl}
								onChange={e => setNewPhotoUrl(e.target.value)}
								required
							/>
							<button type='submit' className='btn-primary'>
								Добавить фото
							</button>
						</form>

						<div className='admin-photos-list'>
							<h3>Все фото ({photos.length})</h3>
							{photos.length === 0 && <p>Фото пока нет</p>}
							{photos.map((url, index) => (
								<div className='admin-photo-item' key={index}>
									<img src={url} alt={`Фото ${index + 1}`} />
									<span className='photo-url'>{url}</span>
									<button className='admin-delete-btn' onClick={() => handleDeletePhoto(index)}>
										Удалить
									</button>
								</div>
							))}
						</div>
					</>
				)}

				{/* ============ ТРЕКИ ============ */}
				{activeTab === 'tracks' && (
					<>
						<form className='admin-form' onSubmit={handleAddTrack}>
							<input
								type='text'
								placeholder='Название трека'
								value={trackForm.title}
								onChange={e => setTrackForm({ ...trackForm, title: e.target.value })}
								required
							/>
							<input
								type='text'
								placeholder='Ссылка на аудио (прямая, .mp3)'
								value={trackForm.audio}
								onChange={e => setTrackForm({ ...trackForm, audio: e.target.value })}
								required
							/>
							<input
								type='text'
								placeholder='Длительность (например 3:20)'
								value={trackForm.duration}
								onChange={e => setTrackForm({ ...trackForm, duration: e.target.value })}
								required
							/>
							<input
								type='text'
								placeholder='Ссылка на обложку (ibb.co)'
								value={trackForm.cover}
								onChange={e => setTrackForm({ ...trackForm, cover: e.target.value })}
							/>
							<button type='submit' className='btn-primary'>
								Добавить трек
							</button>
						</form>

						<div className='admin-news-list'>
							<h3>Все треки ({tracks.length})</h3>
							{tracks.length === 0 && <p>Треков пока нет</p>}
							{tracks.map(track => (
								<div className='admin-news-item' key={track.id}>
									<div className='admin-news-info'>
										<strong>{track.title}</strong>
										<span>{track.duration}</span>
									</div>
									<button className='admin-delete-btn' onClick={() => handleDeleteTrack(track.id)}>
										Удалить
									</button>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default Admin
