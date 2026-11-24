await sn_atf.navigate('/x_enno_pivot')

const libraryButton = await screen.findBySelector('.navbtn[data-view="Capability Library"]')
await user.click(libraryButton)

const capability = await screen.findByText('00000 ATF viewer readonly capability', { exact: true })
expect(capability).toBeVisible()

const family = screen.getBySelector('#capForm select[name="family"]')
await waitFor(() => expect(family).toBeDisabled())

const linkedAppLabel = await screen.findByText('Linked app', { exact: true })
expect(linkedAppLabel).toBeVisible()
const linkedAppName = await screen.findByText('00001 ATF viewer linked installed app', { exact: true })
expect(linkedAppName).toBeVisible()
expect(await screen.queryByRole('combobox', { name: 'Linked app' })).toBeNull()
expect(await screen.queryByRole('button', { name: /^Needs mapping/ })).toBeNull()
