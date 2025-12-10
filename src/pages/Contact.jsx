import emailjs from '@emailjs/browser'
import { Canvas } from '@react-three/fiber'
import { Suspense, useRef, useState, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import flamingoModel from '../assets/3d/flamingo.glb'
import useAlert from '../hooks/useAlert'
import { Alert, Loader } from '../components'

const sanitize = (value) => {
  return value
    .replace(/<[^>]*>/g, '') // rimuove tag HTML
    .replace(/\s+/g, ' ') // comprime spazi
    .trim() // rimuove spazi iniziali/finali
}

const ContactFlamingo = ({ isFlying, isFlyingAway, onFlyAwayComplete }) => {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF(flamingoModel)
  const { actions } = useAnimations(animations, group)
  const [position, setPosition] = useState([0.5, 0.35, 0])
  const [rotation, setRotation] = useState([12.629, -0.6, 0])
  const flyingAwayRef = useRef(false)
  const floatTime = useRef(0)

  useEffect(() => {
    const flyAction = actions?.['flamingo_flyA_'] || Object.values(actions || {})[0]
    if (!flyAction) return

    flyAction.reset()
    flyAction.setLoop(THREE.LoopRepeat, Infinity)

    if (isFlying) {
      flyAction.play()
      flyAction.timeScale = 1.5 // Vola più velocemente quando in focus
    } else {
      flyAction.play()
      flyAction.timeScale = 0.15 // Ali quasi ferme, movimento minimo
    }
  }, [actions, isFlying])

  // Gestione del volo via
  useEffect(() => {
    if (isFlyingAway && !flyingAwayRef.current) {
      flyingAwayRef.current = true

      const animate = () => {
        setPosition((prev) => {
          const newX = prev[0] + 0.08
          const newY = prev[1] + 0.05

          if (newX > 10) {
            flyingAwayRef.current = false
            if (onFlyAwayComplete) onFlyAwayComplete()
            return [0.5, 0.35, 0]
          }

          return [newX, newY, prev[2]]
        })

        setRotation((prev) => [prev[0], prev[1] + 0.05, prev[2]])

        if (flyingAwayRef.current) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }
  }, [isFlyingAway, onFlyAwayComplete])

  // Effetto fluttuante quando fermo (ali aperte ma quasi ferme)
  useEffect(() => {
    if (!isFlying && !isFlyingAway) {
      const animate = () => {
        if (!isFlying && !isFlyingAway && !flyingAwayRef.current) {
          floatTime.current += 0.016
          setPosition((prev) => [prev[0], 0.35 + Math.sin(floatTime.current) * 0.15, prev[2]])
          requestAnimationFrame(animate)
        }
      }
      animate()
    }
  }, [isFlying, isFlyingAway])

  return (
    <group ref={group} position={position} rotation={rotation} scale={[0.9, 0.9, 0.9]} dispose={null}>
      <group scale={0.025}>{nodes?.mesh_0 && <primitive object={nodes.mesh_0} />}</group>
    </group>
  )
}

const Contact = () => {
  const formRef = useRef()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const { alert, showAlert, hideAlert } = useAlert()
  const [loading, setLoading] = useState(false)
  const [isFlying, setIsFlying] = useState(false)
  const [isFlyingAway, setIsFlyingAway] = useState(false)

  const handleChange = ({ target: { name, value } }) => {
    if (alert.show) hideAlert()
    setForm({ ...form, [name]: sanitize(value) })
  }

  const handleFocus = () => setIsFlying(true)
  const handleBlur = () => setIsFlying(false)
  // console.log(
  //   ' import.meta.env.VITE_APP_EMAILJS_SERVICE_ID; import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID:',
  //   import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
  //   import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID
  // )
  const validateForm = () => {
    const newErrors = {}

    if (!form.name || form.name.length < 3) {
      newErrors.name = 'Name and surname must have more than 3 letters'
    }

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Insert a valid email address'
    }

    if (!form.message || form.message.length < 10) {
      newErrors.message = 'Your message must have more than 10 letters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showAlert({ show: true, text: 'Check your input', type: 'danger' })
      return
    }

    setLoading(true)
    setIsFlyingAway(true)

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: 'Stefania Galazzo',
          from_email: form.email,
          to_email: 'galazzostefania@gmail.com',
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false)
          showAlert({
            show: true,
            text: 'Thank you for your message 😃',
            type: 'success',
          })

          setTimeout(() => {
            hideAlert(false)
          }, [3000])
        },
        (error) => {
          setLoading(false)
          console.error(error)
          setIsFlyingAway(false)

          showAlert({
            show: true,
            text: "I didn't receive your message 😢",
            type: 'danger',
          })
        }
      )
  }

  const handleFlyAwayComplete = () => {
    setIsFlyingAway(false)
    setForm({
      name: '',
      email: '',
      message: '',
    })
  }

  return (
    <section className='relative flex lg:flex-row flex-col max-container text-white'>
      {alert.show && <Alert {...alert} />}

      <div className='flex-1 min-w-[50%] flex flex-col'>
        <h1 className='head-text'>Get in Touch</h1>

        <div className='w-full flex flex-col gap-7 mt-14'>
          <label className='text-black-500 font-semibold'>
            Complete Name
            <input
              type='text'
              name='name'
              className='input'
              placeholder='Name and Surname'
              required
              value={form.name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
          </label>
          <label className='text-black-500 font-semibold'>
            Email
            <input
              type='email'
              name='email'
              className='input'
              placeholder='your-email@mail.com'
              required
              value={form.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
          </label>
          <label className='text-black-500 font-semibold'>
            Your Message
            <textarea
              name='message'
              rows='4'
              className='textarea'
              placeholder='Write your ideas here...'
              value={form.message}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {errors.message && <p className='text-red-500 text-sm'>{errors.message}</p>}
          </label>

          <button
            type='button'
            disabled={loading}
            className='btn'
            onClick={handleSubmit}
            onFocus={handleFocus}
            onBlur={handleBlur}>
            {loading ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </div>

      <div className='lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]'>
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}>
          <directionalLight position={[0, 0, 1]} intensity={2.5} />
          <ambientLight intensity={1} />
          <pointLight position={[5, 10, 0]} intensity={2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />

          <Suspense fallback={<Loader />}>
            <ContactFlamingo
              isFlying={isFlying}
              isFlyingAway={isFlyingAway}
              onFlyAwayComplete={handleFlyAwayComplete}
            />
          </Suspense>
        </Canvas>
      </div>
    </section>
  )
}

export default Contact
