// Slide
function initSlide() {
	const wrapper = document.querySelector('[data-slide="wrapper"]')
	const slide = document.querySelector('[data-slide="slide"]')
	const slideImgs = document.querySelectorAll('[data-slide="img"]')

	const slidePos = {
		initial: 0,
		final: 0,
		movement: 0,
	}

	let imgsPos

	function onStart(event) {
		slidePos.initial = event.clientX
		wrapper.addEventListener('mousemove', onMove)
	}

	function onMove(event) {
		const movement = updatePosition(event.clientX)
		slideMove(movement)
	}

	function onEnd() {
		wrapper.removeEventListener('mousemove', onMove)
		slidePos.final = slidePos.movement
	}

	function slideMove(distX) {
		slidePos.movement = distX
		slide.style.transform = `translate3d(${-distX}px, 0, 0)`
	}

	function updatePosition(clientX) {
		const movement = (slidePos.initial - clientX) * 1.4
		return movement + slidePos.final
	}

	function setSlideEvents() {
		slide.addEventListener('mousedown', onStart)
		slide.addEventListener('mouseup', onEnd)
	}

	function getImgsPos() {
		imgsPos = [...slideImgs].map((img) => {
			const pos = img.offsetLeft
			return {
				img,
				pos,
			}
		})
	}

	function changeIndexPos(index) {
		getImgsPos()
		const pos = imgsPos[index].pos
		slidePos.final = pos
		slideMove(pos)
	}

	return {
		setSlideEvents,
		changeIndexPos,
	}
}

const slide = initSlide()
slide.setSlideEvents()
slide.changeIndexPos(0)
const tiltElement = init3dTilt('[data-slide="img"]')
tiltElement.setTiltEvents()

// Tilt
function init3dTilt(element) {
	const tiltElement = document.querySelectorAll(element)
	const mousePos = {}
	const eleDimensions = {}

	function start(event) {
		this.style.transition = 'none'

		mousePos.x = event.clientX
		mousePos.y = event.clientY
		this.addEventListener('mousemove', onMove)
		getElementDimensions(this)
	}

	function onMove(event) {
		const X = event.clientX
		const Y = event.clientY
		mousePos.xMove = Math.abs(eleDimensions.left - X)
		mousePos.yMove = Math.abs(eleDimensions.top - Y)
		if (isInsideElement(X, Y)) {
			console.log('inside element...')
			const { axisX, axisY } = centerDist(mousePos.xMove, mousePos.yMove)
			transformElement(this, axisX, axisY)
		}
	}

	function onLeave() {
		tiltElement.forEach((element) => {
			element.style.transition = '.5s'
			element.style.transform = 'initial'
			// element.removeEventListener('mouseover', start)
			element.removeEventListener('mouseover', onMove)
			// element.removeEventListener('mouseleave', onLeave)
		})
	}

	function isInsideElement(posX, posY) {
		return (
			posX <= eleDimensions.screenWidth &&
			posX >= eleDimensions.left &&
			posY >= eleDimensions.top &&
			posY <= eleDimensions.screenHeight
		)
	}

	function centerDist(posX, posY) {
		const axisX = eleDimensions.width / 2 - posX
		const axisY = eleDimensions.height / 2 - posY
		return {
			axisX,
			axisY,
		}
	}

	function transformElement(element, distX, distY) {
		element.style.transform = `rotateX(${distY / 4}deg) rotateY(${distX / 4}deg)`
	}

	function getElementDimensions(element) {
		eleDimensions.left = element.offsetLeft
		eleDimensions.top = element.getBoundingClientRect().top
		eleDimensions.screenWidth = element.offsetLeft + element.offsetWidth
		eleDimensions.screenHeight =
			element.getBoundingClientRect().top + element.offsetHeight
		eleDimensions.width = element.offsetWidth
		eleDimensions.height = element.offsetHeight
	}

	function setTiltEvents() {
		tiltElement.forEach((element) => {
			element.addEventListener('mouseover', start)
			element.addEventListener('mouseleave', onLeave)
		})
	}

	return {
		setTiltEvents,
	}
}
