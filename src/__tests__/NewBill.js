/* global describe, test, jest, expect, File */
/* eslint no-undef: "error" */

import { screen, fireEvent } from '@testing-library/dom'
import { ROUTES } from '../constants/routes'
import { localStorageMock } from '../__mocks__/localStorage.js'
import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'
import store from '../app/Store.js'

const NOTE = {
  type: 'Hôtel et logement',
  name: 'Train',
  amount: '150',
  date: '2022-01-01',
  vat: '7',
  pct: '20',
  commentary: 'commentaire',
  fileUrl: 'https://annaba.consulfrance.org/local/cache-vignettes/L324xH155/4ce01192b8e5ef3b-fc0db.png?1569838008.png',
  fileName: 'justificatif.png'
}

const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({ pathname }) }

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
const html = NewBillUI()
document.body.innerHTML = html
const unBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage })
const form = screen.getByTestId('form-new-bill')
jest.spyOn(window, 'alert').mockImplementation(() => {})

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    test('then load file format is correct', async () => {
      const file = screen.getByTestId('file')
      const handleChangeFile = jest.fn(() => unBill.handleChangeFile)
      file.addEventListener('change', handleChangeFile)

      const fileImg = new File(['NomFichier'], 'testFile.png', { type: 'image/png' })
      fireEvent.change(file, { target: { files: [fileImg] } })
      await handleChangeFile
      expect(handleChangeFile).toHaveBeenCalled()
      expect(file.files[0]).toStrictEqual(fileImg)
      expect(file.files).toHaveLength(1)
      expect(window.alert).not.toHaveBeenCalled()
    })

    test('then load file format is not correct', async () => {
      const file = screen.getByTestId('file')
      const handleChangeFile = jest.fn(() => unBill.handleChangeFile)
      file.addEventListener('change', handleChangeFile)

      const fileImg = new File(['NomFichier'], 'testFile.pdf', { type: 'text/pdf' })
      fireEvent.change(file, { target: { files: [fileImg] } })
      await handleChangeFile
      expect(handleChangeFile).toHaveBeenCalled()
      expect(file.files[0]).toStrictEqual(fileImg)
      expect(file.files).toHaveLength(1)
      expect(window.alert).toHaveBeenCalled()
    })

    test('Then am create a newbill', async () => {
      const inputTypeDepense = screen.getByTestId('expense-type')
      expect(inputTypeDepense).not.toBeUndefined()
      fireEvent.change(inputTypeDepense, { target: { value: NOTE.type } })
      expect(inputTypeDepense.value).toBe(NOTE.type)

      const inputDepense = screen.getByTestId('expense-name')
      expect(inputDepense).not.toBeUndefined()
      fireEvent.change(inputDepense, { target: { value: NOTE.name } })
      expect(inputDepense.value).toBe(NOTE.name)

      const inputDate = screen.getByTestId('datepicker')
      expect(inputDate).not.toBeUndefined()
      fireEvent.change(inputDate, { target: { value: NOTE.date } })
      expect(inputDate.value).toBe(NOTE.date)

      const inputMontantTTC = screen.getByTestId('amount')
      expect(inputMontantTTC).not.toBeUndefined()
      fireEvent.change(inputMontantTTC, { target: { value: NOTE.amount } })
      expect(inputMontantTTC.value).toBe(NOTE.amount)

      const inputVat = screen.getByTestId('vat')
      expect(inputVat).not.toBeUndefined()
      fireEvent.change(inputVat, { target: { value: NOTE.vat } })
      expect(inputVat.value).toBe(NOTE.vat)

      const inputPct = screen.getByTestId('pct')
      expect(inputPct).not.toBeUndefined()
      fireEvent.change(inputPct, { target: { value: NOTE.pct } })
      expect(inputPct.value).toBe(NOTE.pct)

      const inputCommentaire = screen.getByTestId('commentary')
      expect(inputCommentaire).not.toBeUndefined()
      fireEvent.change(inputCommentaire, { target: { value: NOTE.commentary } })
      expect(inputCommentaire.value).toBe(NOTE.commentary)

      /* unBill.fileUrl = NOTE.fileUrl
      unBill.fileName = NOTE.fileName */

      const file = screen.getByTestId('file')
      const handleChangeFile = jest.fn(() => unBill.handleChangeFile)
      file.addEventListener('change', handleChangeFile)

      const fileImg = new File(['NomFichier'], 'testFile.png', { type: 'image/png' })
      fireEvent.change(file, { target: { files: [fileImg] } })
      await handleChangeFile
      expect(handleChangeFile).toHaveBeenCalled()

      const handleSubmit = jest.fn(() => unBill.handleSubmit)
      expect(form).not.toBeUndefined()
      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})
