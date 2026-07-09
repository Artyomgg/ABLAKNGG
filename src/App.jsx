import { useEffect, useRef, useState } from 'react'
import './App.css'

export function App() {
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTrack, setCurrentTrack] = useState(null)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
	const [photos, setPhotos] = useState([])
	const [news, setNews] = useState([])
	const [tracks, setTracks] = useState([])
	const [loadingNews, setLoadingNews] = useState(true)
	const [loadingPhotos, setLoadingPhotos] = useState(true)
	const [loadingTracks, setLoadingTracks] = useState(true)
	const audioRef = useRef(null)

	// ========== ЗАГРУЗКА ФОТО С GITHUB ==========
	useEffect(() => {
		const loadPhotos = async () => {
			try {
				const response = await fetch(
					'https://raw.githubusercontent.com/Artyomgg/ABLAKNEWS/main/photos.json',
				)
				if (response.ok) {
					const data = await response.json()
					setPhotos(data)
				} else {
					console.log('Файл photos.json не найден, использую стандартные фото')
					setPhotos(['/images/artist-1.jpg', '/images/artist-2.jpg', '/images/artist-3.jpg'])
				}
			} catch (error) {
				console.error('Ошибка загрузки фото:', error)
				setPhotos(['/images/artist-1.jpg', '/images/artist-2.jpg', '/images/artist-3.jpg'])
			} finally {
				setLoadingPhotos(false)
			}
		}
		loadPhotos()
	}, [])

	// ========== ЗАГРУЗКА НОВОСТЕЙ С GITHUB ==========
	useEffect(() => {
		const loadNews = async () => {
			try {
				const response = await fetch(
					'https://raw.githubusercontent.com/Artyomgg/ABLAKNEWS/main/news.json',
				)
				if (response.ok) {
					const data = await response.json()
					setNews(data)
				} else {
					console.log('Файл новостей не найден')
					setNews([])
				}
			} catch (error) {
				console.error('Ошибка загрузки новостей:', error)
				setNews([])
			} finally {
				setLoadingNews(false)
			}
		}
		loadNews()
	}, [])

	// ========== ЗАГРУЗКА ТРЕКОВ С GITHUB ==========
	useEffect(() => {
		const loadTracks = async () => {
			try {
				const response = await fetch(
					'https://raw.githubusercontent.com/Artyomgg/ABLAKNEWS/main/tracks.json',
				)
				if (response.ok) {
					const data = await response.json()
					setTracks(data)
				} else {
					console.log('Файл tracks.json не найден')
					setTracks([])
				}
			} catch (error) {
				console.error('Ошибка загрузки треков:', error)
				setTracks([])
			} finally {
				setLoadingTracks(false)
			}
		}
		loadTracks()
	}, [])

	// ========== АВТОПЕРЕКЛЮЧЕНИЕ ФОТО ==========
	useEffect(() => {
		if (photos.length === 0) return
		const interval = setInterval(() => {
			setCurrentPhotoIndex(prev => (prev + 1) % photos.length)
		}, 4000)
		return () => clearInterval(interval)
	}, [photos.length])

	const prevPhoto = () => {
		if (photos.length === 0) return
		setCurrentPhotoIndex(prev => (prev - 1 + photos.length) % photos.length)
	}

	const nextPhoto = () => {
		if (photos.length === 0) return
		setCurrentPhotoIndex(prev => (prev + 1) % photos.length)
	}

	// ========== ПЛЕЕР ==========
	const playTrack = track => {
		if (currentTrack?.id === track.id) {
			setIsPlaying(!isPlaying)
		} else {
			setCurrentTrack(track)
			setIsPlaying(true)
		}
	}

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

		if (isPlaying) {
			audio.play().catch(() => {})
		} else {
			audio.pause()
		}
	}, [isPlaying, currentTrack])

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

		const updateTime = () => {
			setCurrentTime(audio.currentTime)
			setDuration(audio.duration || 0)
		}

		audio.addEventListener('timeupdate', updateTime)
		audio.addEventListener('loadedmetadata', updateTime)

		return () => {
			audio.removeEventListener('timeupdate', updateTime)
			audio.removeEventListener('loadedmetadata', updateTime)
		}
	}, [])

	const formatTime = seconds => {
		if (isNaN(seconds)) return '0:00'
		const mins = Math.floor(seconds / 60)
		const secs = Math.floor(seconds % 60)
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`
	}

	// ========== ЗАГЛУШКИ ДЛЯ ЗАГРУЗКИ ==========
	const displayPhotos =
		loadingPhotos || photos.length === 0
			? ['/images/artist-1.jpg', '/images/artist-2.jpg', '/images/artist-3.jpg']
			: photos

	const displayTracks = loadingTracks ? [] : tracks

	return (
		<div className='app'>
			<audio ref={audioRef} src={currentTrack?.audio} />

			{/* HERO */}
			<section className='hero'>
				<div className='hero-overlay'></div>
				<div className='hero-content'>
					<p className='hero-label'>ABLAK NGG</p>
					<h1 className='hero-title'>
						Рэп и хип-хоп <br />
						<span>из Минска</span>
					</h1>
					<p className='hero-subtitle'>
						Исполнитель и автор песен из Минска. <br />
						Работает в жанре рэп и хип-хоп. <br />
						Треки выходят без фиксированного графика.
					</p>
					<div className='hero-buttons'>
						<a href='#tracks' className='btn-primary'>
							Слушать треки
						</a>
						<a href='#about' className='btn-secondary'>
							Об исполнителе
						</a>
					</div>
				</div>
			</section>

			{/* ABOUT */}
			<section className='about' id='about'>
				<div className='container'>
					<div className='about-grid'>
						<div className='about-text'>
							<span className='section-label'>Кто я</span>
							<h2>ABLAK NGG</h2>
							<p>
								Исполнитель и автор песен из Минска. <br />
								Работает в жанре рэп и хип-хоп.
							</p>
							<p>
								Треки выходят без фиксированного графика. <br />
								Без расписания, без обещаний, без рамок.
							</p>
							<p>
								Я не гэнгстер, не звезда, не герой. <br />Я просто парень, который иногда записывает
								то, что внутри.
							</p>
						</div>
						<div className='about-image'>
							<div className='carousel'>
								<img
									src={displayPhotos[currentPhotoIndex % displayPhotos.length]}
									alt='ABLAK NGG'
									className='carousel-image'
									onError={e => {
										e.target.src = '/images/default-news.jpg'
									}}
								/>
								{displayPhotos.length > 1 && (
									<>
										<button className='carousel-btn prev' onClick={prevPhoto}>
											‹
										</button>
										<button className='carousel-btn next' onClick={nextPhoto}>
											›
										</button>
										<div className='carousel-dots'>
											{displayPhotos.map((_, index) => (
												<span
													key={index}
													className={`dot ${index === currentPhotoIndex % displayPhotos.length ? 'active' : ''}`}
													onClick={() => setCurrentPhotoIndex(index)}
												/>
											))}
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* NEWS */}
			<section className='news' id='news'>
				<div className='container'>
					<div className='section-header'>
						<span className='section-label'>Новости</span>
						<h2>Последние обновления</h2>
					</div>

					{loadingNews && (
						<p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Загрузка...</p>
					)}

					{!loadingNews && news.length === 0 && (
						<p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Новостей пока нет</p>
					)}

					<div className='news-grid'>
						{news.map(item => (
							<div className='news-card' key={item.id}>
								{item.image && (
									<div className='news-image'>
										<img
											src={item.image}
											alt={item.title}
											onError={e => {
												e.target.style.display = 'none'
											}}
										/>
									</div>
								)}
								<div className='news-content'>
									<span className='news-date'>{item.date}</span>
									<h3>{item.title}</h3>
									<p>{item.description}</p>
									{item.link && (
										<a href={item.link} className='news-link'>
											Подробнее →
										</a>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* TRACKS */}
			<section className='tracks' id='tracks'>
				<div className='container'>
					<div className='section-header'>
						<span className='section-label'>Слушать</span>
						<h2>Треки</h2>
					</div>

					{loadingTracks && (
						<p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
							Загрузка треков...
						</p>
					)}

					{!loadingTracks && displayTracks.length === 0 && (
						<p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Треков пока нет</p>
					)}

					<div className='tracks-list'>
						{displayTracks.map(track => (
							<div
								key={track.id}
								className={`track-item ${currentTrack?.id === track.id ? 'active' : ''}`}
								onClick={() => playTrack(track)}
							>
								<div className='track-cover-small'>
									<img src={track.cover || '/images/default-cover.jpg'} alt={track.title} />
								</div>
								<div className='track-info'>
									<h4>{track.title}</h4>
									<p>{track.duration || '0:00'}</p>
								</div>
								<button className='play-btn-small'>
									{currentTrack?.id === track.id && isPlaying ? <PauseIcon /> : <PlayIcon />}
								</button>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* PLAYER */}
			{currentTrack && (
				<div className='player'>
					<div className='player-info'>
						<img
							src={currentTrack.cover || '/images/default-cover.jpg'}
							alt={currentTrack.title}
							className='player-cover'
						/>
						<div>
							<h4>{currentTrack.title}</h4>
							<p>ABLAK NGG</p>
						</div>
					</div>
					<div className='player-controls'>
						<button className='player-btn' onClick={() => setIsPlaying(!isPlaying)}>
							{isPlaying ? <PauseIcon /> : <PlayIcon />}
						</button>
						<div className='player-progress'>
							<span>{formatTime(currentTime)}</span>
							<div className='progress-bar'>
								<div
									className='progress-fill'
									style={{ width: `${(currentTime / duration) * 100}%` }}
								></div>
							</div>
							<span>{formatTime(duration)}</span>
						</div>
					</div>
				</div>
			)}

			{/* CONTACT */}
			<section className='contact' id='contact'>
				<div className='container'>
					<div className='section-header'>
						<span className='section-label'>Связаться</span>
						<h2>Напиши мне</h2>
					</div>
					<div className='contact-grid'>
						<div className='contact-info'>
							<p>
								📧 <a href='mailto:ablak.ngg@mail.ru'>ablak.ngg@mail.ru</a>
							</p>
							<p>
								📱{' '}
								<a href='https://t.me/your_telegram' target='_blank'>
									Telegram
								</a>
							</p>
							<p>
								📱{' '}
								<a href='https://instagram.com/your_instagram' target='_blank'>
									Instagram
								</a>
							</p>
							<p>
								📱{' '}
								<a href='https://vk.com/your_vk' target='_blank'>
									VK
								</a>
							</p>
							<div className='contact-cta'>
								<p>Напиши мне — я отвечу, когда будет настроение</p>
							</div>
						</div>
						<form className='contact-form'>
							<input type='text' placeholder='Имя' />
							<input type='email' placeholder='Email' />
							<textarea placeholder='Сообщение' rows='5'></textarea>
							<button type='submit' className='btn-primary'>
								Отправить
							</button>
						</form>
					</div>
				</div>
			</section>

			{/* FOOTER */}
			<footer className='footer'>
				<div className='container'>
					<div className='footer-content'>
						<div className='footer-brand'>
							<h3>ABLAK NGG</h3>
							<p>Исполнитель и автор песен из Минска</p>
							<p className='footer-tags'>Рэп • Хип-хоп • Без графика</p>
						</div>
						<div className='footer-links'>
							<a href='#about'>Об исполнителе</a>
							<a href='#tracks'>Треки</a>
							<a href='#contact'>Связаться</a>
						</div>
						<div className='footer-socials'>
							<a href='#' target='_blank'>
								TG
							</a>
							<a href='#' target='_blank'>
								IG
							</a>
							<a href='#' target='_blank'>
								VK
							</a>
						</div>
					</div>
					<div className='footer-bottom'>
						<p>© 2026 ABLAK NGG. Все права защищены.</p>
					</div>
				</div>
			</footer>
		</div>
	)
}

function PlayIcon() {
	return (
		<svg viewBox='0 0 24 24' width='24' height='24'>
			<path fill='currentColor' d='M8 5v14l11-7z' />
		</svg>
	)
}

function PauseIcon() {
	return (
		<svg viewBox='0 0 24 24' width='24' height='24'>
			<path fill='currentColor' d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
		</svg>
	)
}

export default App
