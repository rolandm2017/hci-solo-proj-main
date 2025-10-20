import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

type SuggestedVideo = {
  id: string
  title: string
  channel: string
  views: string
  timeAgo: string
  thumbnail: string
}

type Comment = {
  id: string
  author: string
  timeAgo: string
  text: string
}

const suggestedVideos: SuggestedVideo[] = [
  {
    id: '1',
    title: 'Understanding Recommendation Engines in 12 Minutes',
    channel: 'Insightful Media Lab',
    views: '842K views',
    timeAgo: '2 weeks ago',
    thumbnail: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=420&q=60',
  },
  {
    id: '2',
    title: 'Designing Accessible Video Controls for Everyone',
    channel: 'Interaction Weekly',
    views: '126K views',
    timeAgo: '3 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=420&q=60',
  },
  {
    id: '3',
    title: 'A Day in the Life of a Product Designer',
    channel: 'Creativity Corner',
    views: '512K views',
    timeAgo: '1 month ago',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=420&q=60',
  },
  {
    id: '4',
    title: 'Hotkeys That Power Video Creators',
    channel: 'Shortcut Stories',
    views: '94K views',
    timeAgo: '4 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?auto=format&fit=crop&w=420&q=60',
  },
  {
    id: '5',
    title: 'When UX Research Meets Entertainment Platforms',
    channel: 'Better UX',
    views: '378K views',
    timeAgo: '11 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=420&q=60',
  },
  {
    id: '6',
    title: 'Focus Mode for Streaming Services — Case Study',
    channel: 'Calm Product',
    views: '209K views',
    timeAgo: '3 weeks ago',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=420&q=60',
  },
]

const comments: Comment[] = [
  {
    id: 'c1',
    author: 'Aurora P.',
    timeAgo: '2 hours ago',
    text: 'Love how the presenter breaks down attention management on video platforms. Super relevant to our team right now.',
  },
  {
    id: 'c2',
    author: 'PixelPilot',
    timeAgo: '5 hours ago',
    text: 'Hotkeys are underrated. I keep forgetting about them, so a persistent guide sounds genuinely helpful.',
  },
  {
    id: 'c3',
    author: 'Devon S.',
    timeAgo: '1 day ago',
    text: 'The callout about context switching hit home. Would be cool to see focus tools paired with better keyboard hints.',
  },
  {
    id: 'c4',
    author: 'CaseyNg',
    timeAgo: '3 days ago',
    text: 'I really appreciate the framing of “upgrades” instead of “fixes.” Makes the discussion feel intentional.',
  },
]

const hotkeyCheatSheet: Array<{ key: string; action: string }> = [
  { key: 'K', action: 'Play/Pause' },
  { key: 'J', action: 'Rewind 10 seconds' },
  { key: 'L', action: 'Fast-forward 10 seconds' },
  { key: 'F', action: 'Toggle full screen' },
  { key: 'M', action: 'Mute/Unmute' },
  { key: '0-9', action: 'Jump to specific timestamp' },
  { key: 'Shift + N', action: 'Next video' },
  { key: 'Shift + P', action: 'Previous video' },
  { key: 'Up/Down', action: 'Volume up/down' },
  { key: 'Left/Right', action: 'Seek 5 seconds' },
]

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [stableVolume, setStableVolume] = useState(true)
  const [ambientMode, setAmbientMode] = useState(false)
  const [annotations, setAnnotations] = useState(false)
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true)
  const [sleepTimerEnabled, setSleepTimerEnabled] = useState(false)
  const [alwaysShowHotkeys, setAlwaysShowHotkeys] = useState(false)
  const [isHotkeyModalOpen, setIsHotkeyModalOpen] = useState(false)
  const [transientHotkeysVisible, setTransientHotkeysVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const settingsMenuRef = useRef<HTMLDivElement | null>(null)
  const settingsButtonRef = useRef<HTMLButtonElement | null>(null)
  const transientTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isSettingsOpen) {
        return
      }

      const target = event.target as Node | null
      const menuEl = settingsMenuRef.current
      const buttonEl = settingsButtonRef.current

      if (
        menuEl &&
        buttonEl &&
        !menuEl.contains(target) &&
        !buttonEl.contains(target)
      ) {
        setIsSettingsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSettingsOpen])

  useEffect(() => {
    return () => {
      if (transientTimerRef.current) {
        window.clearTimeout(transientTimerRef.current)
      }
    }
  }, [])

  const hideHotkeyHints = useCallback(() => {
    setTransientHotkeysVisible(false)
    if (transientTimerRef.current) {
      window.clearTimeout(transientTimerRef.current)
      transientTimerRef.current = null
    }
  }, [])

  const hotkeyHintsVisible = alwaysShowHotkeys || transientHotkeysVisible

  const handlePlayPause = useCallback(() => {
    setIsPlaying((value) => !value)
  }, [])

  const handleShowHotkeysBriefly = () => {
    setTransientHotkeysVisible(true)
    if (transientTimerRef.current) {
      window.clearTimeout(transientTimerRef.current)
    }
    transientTimerRef.current = window.setTimeout(() => {
      setTransientHotkeysVisible(false)
      transientTimerRef.current = null
    }, 3500)
  }

  const toggleSwitch = (
    currentValue: boolean,
    setter: (value: boolean) => void,
  ) => {
    setter(!currentValue)
  }

  const formattedHotkeyGroups = useMemo(() => {
    const midpoint = Math.ceil(hotkeyCheatSheet.length / 2)
    return [
      hotkeyCheatSheet.slice(0, midpoint),
      hotkeyCheatSheet.slice(midpoint),
    ]
  }, [])

  useEffect(() => {
    if (!hotkeyHintsVisible) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const normalizedKey = event.key.toLowerCase()
      const normalizedCode = event.code.toLowerCase()

      const isSpace =
        normalizedKey === ' ' ||
        normalizedKey === 'space' ||
        normalizedKey === 'spacebar' ||
        normalizedCode === 'space'

      if (isSpace) {
        event.preventDefault()
        handlePlayPause()
        if (!alwaysShowHotkeys) {
          hideHotkeyHints()
        }
        return
      }

      const isOtherHotkey =
        normalizedKey === 'c' ||
        normalizedKey === 't' ||
        normalizedKey === 'arrowup' ||
        normalizedKey === 'arrowdown' ||
        normalizedCode === 'keyc' ||
        normalizedCode === 'keyt' ||
        normalizedCode === 'arrowup' ||
        normalizedCode === 'arrowdown'

      if (isOtherHotkey) {
        event.preventDefault()
        if (!alwaysShowHotkeys) {
          hideHotkeyHints()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hotkeyHintsVisible, hideHotkeyHints, handlePlayPause, alwaysShowHotkeys])

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="top-bar__left">
          <button className="icon-button" aria-label="Open navigation">
            <span className="icon icon--menu" />
          </button>
          <div className="brand">
            <span className="brand__mark" />
            <span className="brand__text">StreamLab</span>
          </div>
        </div>
        <form className="search-bar">
          <input
            type="search"
            placeholder="Search"
            aria-label="Search videos"
          />
          <button className="search-bar__submit" type="submit">
            <span className="icon icon--search" />
          </button>
          <button
            className="icon-button mic-button"
            type="button"
            aria-label="Voice search"
          >
            <span className="icon icon--mic" />
          </button>
        </form>
        <div className="top-bar__right">
          <button className="icon-button" aria-label="Create">
            <span className="icon icon--plus" />
          </button>
          <button className="icon-button" aria-label="Notifications">
            <span className="icon icon--bell" />
            <span className="badge">3</span>
          </button>
          <div className="avatar">AP</div>
        </div>
      </header>
      <main className="watch-layout">
        <div className="watch-content">
          <section className="player-section">
            <div className="video-player">
              <div className="video-screen" />
              <div className="player-controls">
                <div className="player-controls__start">
                  <div className="control-button">
                    <button
                      className="icon-button"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      onClick={handlePlayPause}
                    >
                      <span
                        className={`icon ${isPlaying ? 'icon--pause' : 'icon--play'}`}
                      />
                    </button>
                    {hotkeyHintsVisible && (
                      <span className="control-hotkey">Space</span>
                    )}
                  </div>
                  <button className="icon-button" aria-label="Rewind">
                    <span className="icon icon--rewind" />
                  </button>
                  <button className="icon-button" aria-label="Fast forward">
                    <span className="icon icon--forward" />
                  </button>
                  <div className="volume-control">
                    <div className="control-button">
                      <button className="icon-button" aria-label="Volume">
                        <span className="icon icon--volume" />
                      </button>
                      {hotkeyHintsVisible && (
                        <span className="control-hotkey">
                          <span>Up</span>
                          <span>Down</span>
                        </span>
                      )}
                    </div>
                    <div className="volume-bar">
                      <div className="volume-bar__value" style={{ width: '68%' }} />
                    </div>
                  </div>
                  <div className="timecode">12:43 / 24:16</div>
                </div>
                <div className="player-controls__center">
                  <div className="progress-bar">
                    <div className="progress-bar__buffer" />
                    <div className="progress-bar__value" style={{ width: '53%' }} />
                  </div>
                </div>
                <div className="player-controls__end">
                  <div className="control-button">
                    <button className="icon-button small" aria-label="Captions">
                      CC
                    </button>
                    {hotkeyHintsVisible && (
                      <span className="control-hotkey">C</span>
                    )}
                  </div>
                  <button className="icon-button small" aria-label="Mini player">
                    <span className="icon icon--mini" />
                  </button>
                  <button
                    ref={settingsButtonRef}
                    className="icon-button"
                    aria-label="Settings"
                    onClick={() => setIsSettingsOpen((open) => !open)}
                  >
                    <span className="icon icon--settings" />
                  </button>
                  <div className="control-button">
                    <button className="icon-button" aria-label="Full screen">
                      <span className="icon icon--fullscreen" />
                    </button>
                    {hotkeyHintsVisible && (
                      <span className="control-hotkey">T</span>
                    )}
                  </div>
                </div>
              </div>
              {isSettingsOpen && (
                <div className="settings-menu" ref={settingsMenuRef}>
                  <div className="settings-menu__header">Settings</div>
                  <ul className="settings-menu__list">
                    <li>
                      <button
                        className="menu-toggle"
                        type="button"
                        onClick={() => toggleSwitch(stableVolume, setStableVolume)}
                      >
                        <span className="menu-toggle__label">Stable volume</span>
                        <span
                          className={`switch ${stableVolume ? 'switch--on' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-toggle"
                        type="button"
                        onClick={() => toggleSwitch(ambientMode, setAmbientMode)}
                      >
                        <span className="menu-toggle__label">Ambient mode</span>
                        <span
                          className={`switch ${ambientMode ? 'switch--on' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-toggle"
                        type="button"
                        onClick={() => toggleSwitch(annotations, setAnnotations)}
                      >
                        <span className="menu-toggle__label">Annotations</span>
                        <span
                          className={`switch ${annotations ? 'switch--on' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-toggle"
                        type="button"
                        onClick={() =>
                          toggleSwitch(subtitlesEnabled, setSubtitlesEnabled)
                        }
                      >
                        <span className="menu-toggle__label">Subtitles/CC (1)</span>
                        <span className="menu-toggle__value">
                          {subtitlesEnabled ? 'On' : 'Off'}
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-toggle"
                        type="button"
                        onClick={() =>
                          toggleSwitch(sleepTimerEnabled, setSleepTimerEnabled)
                        }
                      >
                        <span className="menu-toggle__label">Sleep timer</span>
                        <span className="menu-toggle__value">
                          {sleepTimerEnabled ? 'On' : 'Off'}
                        </span>
                      </button>
                    </li>
                    <li>
                      <button className="menu-toggle" type="button">
                        <span className="menu-toggle__label">Playback speed</span>
                        <span className="menu-toggle__value">Normal</span>
                      </button>
                    </li>
                    <li>
                      <button className="menu-toggle" type="button">
                        <span className="menu-toggle__label">Quality</span>
                        <span className="menu-toggle__value">Auto (480p)</span>
                      </button>
                    </li>
                  </ul>
                  <div className="settings-menu__divider" />
                  <div className="settings-menu__header">Hotkey experiments</div>
                  <ul className="settings-menu__list">
                    <li>
                      <button
                        className="menu-toggle"
                        type="button"
                        onClick={() => {
                          setAlwaysShowHotkeys((value) => !value)
                          setTransientHotkeysVisible(false)
                        }}
                      >
                        <span className="menu-toggle__label">
                          Always show hotkeys
                        </span>
                        <span
                          className={`switch ${
                            alwaysShowHotkeys ? 'switch--on' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-toggle"
                        type="button"
                        onClick={handleShowHotkeysBriefly}
                      >
                        <span className="menu-toggle__label">
                          Show hotkeys briefly
                        </span>
                        <span className="menu-toggle__value">Tap to preview</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="menu-toggle"
                        type="button"
                        onClick={() => setIsHotkeyModalOpen(true)}
                      >
                        <span className="menu-toggle__label">
                          Open hotkey manual
                        </span>
                        <span className="menu-toggle__value">View</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="video-header">
              <h1 className="video-title">
                Designing Intentional Upgrades for Streaming Interfaces
              </h1>
              <div className="video-meta">
                <span>128,421 views</span>
                <span>•</span>
                <span>Premiered Mar 14, 2024</span>
              </div>
            </div>
            <div className="video-actions">
              <div className="channel-card">
                <div className="channel-card__avatar">IL</div>
                <div className="channel-card__meta">
                  <div className="channel-card__name">Interaction Lab</div>
                  <div className="channel-card__subs">1.2M subscribers</div>
                </div>
                <button className="subscribe-button" type="button">
                  Join
                </button>
                <button className="subscribe-button subscribe-button--solid" type="button">
                  Subscribe
                </button>
              </div>
              <div className="engagement-row">
                <button className="pill-button" type="button">
                  <span className="icon icon--thumbs-up" />
                  10K
                </button>
                <button className="pill-button" type="button">
                  <span className="icon icon--thumbs-down" />
                  126
                </button>
                <button className="pill-button" type="button">
                  <span className="icon icon--share" />
                  Share
                </button>
                <button className="pill-button" type="button">
                  <span className="icon icon--clip" />
                  Clip
                </button>
                <button className="pill-button" type="button">
                  <span className="icon icon--save" />
                  Save
                </button>
                <button className="pill-button" type="button">
                  <span className="icon icon--more" />
                </button>
              </div>
            </div>
            <div className="video-description">
              <div className="video-description__summary">
                Today we are looking at three targeted upgrades to the video player
                experience. Each concept keeps the familiar layout intact while
                layering in keyboard-first affordances that help people stay in the
                flow when they watch and learn.
              </div>
              <ul className="video-description__details">
                <li>00:00 — Why upgrades beat “fixes”</li>
                <li>04:12 — Mapping attention anchors</li>
                <li>11:35 — Prototype walkthrough</li>
              </ul>
              <button className="show-more-button" type="button">
                Show more
              </button>
            </div>
            <section className="comments">
              <div className="comments__header">
                <h2>Comments</h2>
                <span className="comments__count">1,482</span>
              </div>
              <div className="comment-input">
                <div className="avatar avatar--small">AP</div>
                <div className="comment-input__field">Share your thoughts…</div>
              </div>
              <ul className="comment-list">
                {comments.map((comment) => (
                  <li key={comment.id} className="comment">
                    <div className="avatar avatar--small">
                      {comment.author.slice(0, 2)}
                    </div>
                    <div className="comment__body">
                      <div className="comment__meta">
                        <span className="comment__author">{comment.author}</span>
                        <span className="comment__time">{comment.timeAgo}</span>
                      </div>
                      <p>{comment.text}</p>
                      <div className="comment__actions">
                        <button type="button">Like</button>
                        <button type="button">Reply</button>
                        <button type="button">Share</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </section>
        </div>
        <aside className="sidebar">
          <h2 className="sidebar__heading">Up next</h2>
          <ul className="sidebar__list">
            {suggestedVideos.map((video) => (
              <li key={video.id} className="sidebar-item">
                <div className="thumbnail">
                  <img src={video.thumbnail} alt="" />
                  <span className="thumbnail__time">12:36</span>
                </div>
                <div className="thumbnail__meta">
                  <div className="thumbnail__title">{video.title}</div>
                  <div className="thumbnail__channel">{video.channel}</div>
                  <div className="thumbnail__stats">
                    {video.views} • {video.timeAgo}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </main>
      {isHotkeyModalOpen && (
        <div
          className="hotkey-modal__backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Hotkey manual"
          onClick={() => setIsHotkeyModalOpen(false)}
        >
          <div
            className="hotkey-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="hotkey-modal__header">
              <h3>Keyboard shortcut manual</h3>
              <button
                className="icon-button"
                type="button"
                aria-label="Close hotkey manual"
                onClick={() => setIsHotkeyModalOpen(false)}
              >
                <span className="icon icon--close" />
              </button>
            </div>
            <div className="hotkey-modal__content">
              {formattedHotkeyGroups.map((group, index) => (
                <ul key={index} className="hotkey-modal__list">
                  {group.map((item) => (
                    <li key={item.key}>
                      <span className="hotkey-modal__key">{item.key}</span>
                      <span className="hotkey-modal__action">{item.action}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
            <div className="hotkey-modal__footer">
              <button
                className="pill-button"
                type="button"
                onClick={() => {
                  setIsHotkeyModalOpen(false)
                  setAlwaysShowHotkeys(true)
                }}
              >
                Pin overlay to player
              </button>
              <button
                className="pill-button"
                type="button"
                onClick={() => setIsHotkeyModalOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
