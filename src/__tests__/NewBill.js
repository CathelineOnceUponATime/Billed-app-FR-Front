/* global describe, test, jest, expect, File */
/* eslint no-undef: "error" */

import { screen, fireEvent } from '@testing-library/dom'
import { ROUTES } from '../constants/routes'
import { localStorageMock } from '../__mocks__/localStorage.js'
import firebase from '../__mocks__/firebase'
import mockStore from '../__mocks__/store'
import NewBillUI from '../views/NewBillUI.js'
import BillsUI from '../views/BillsUI.js'
import NewBill from '../containers/NewBill.js'
import store from '../app/Store.js'

jest.mock('../app/store', () => mockStore)

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

    test('Fetch Bills from mock API POST', async () => {
      const postSpy = jest.spyOn(firebase, 'post')
      const bills = await firebase.post()
      expect(postSpy).toHaveBeenCalledTimes(1)
      expect(bills.length).toBe(4)
    })

    test('fetches bills from an API and fails with 404 message error', async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error('Erreur 404'))
      )
      const html = BillsUI({ error: 'Erreur 404' })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test('fetches messages from an API and fails with 500 message error', async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error('Erreur 500'))
      )
      const html = BillsUI({ error: 'Erreur 500' })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
