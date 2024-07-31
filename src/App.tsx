import * as C from './app.styles'
import * as Photos from './services/photos'
import { useState, useEffect, FormEvent } from 'react'
import { Photo } from './types/PhotoTypes'
import { PhotoItem } from './components/PhotoItem'

const App = () => {


  const [upload, setUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])

  
  useEffect(()=> {
    const getPhotos = async () => {
      setLoading(true)
      setPhotos(await Photos.getAll())
      setLoading(false)
    }
    getPhotos()
  }, [])

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement> ) => {
      e.preventDefault()

      const formData = new FormData(e.currentTarget)
      const file = formData.get('image') as File

      if(file && file.size > 0) {
        setUpload(true)
          let result = await Photos.insert(file)
        setUpload(false)

        if (result instanceof Error) {
          alert(`${result.name} - ${result.message}`)
        } else {
          let newPhotoList = [...photos]
          newPhotoList.push(result)
          setPhotos(newPhotoList)
        }

      }
  }

  return (
    <C.Container>
      <C.Area>
        <C.Header>Galeria de Fotos</C.Header>

        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type='file' name='image'/>
          <input type='submit' value="Enviar"/>
          {upload && "Enviando..."}
        </C.UploadForm>

        {loading &&
          <C.ScreenWarning>
            <div className='emoji'>🔄</div>
            <div>Loading...</div>
          </C.ScreenWarning>
        }

        {!loading && photos.length > 0 &&
          <C.PhotoList>
            {photos.map((item, index) => (
              <PhotoItem key={index} url={item.url} name={item.name} />
            ))}
          </C.PhotoList>
        } 

       {!loading && photos.length === 0 &&
          <C.ScreenWarning>
          <div className='emoji'>⭕</div>
          <div>Não há fotos cadastradas</div>
          </C.ScreenWarning>
       }

      </C.Area>
    </C.Container>
  )

}

export default App