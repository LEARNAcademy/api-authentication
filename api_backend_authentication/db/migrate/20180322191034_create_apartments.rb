class CreateApartments < ActiveRecord::Migration[5.1]
  def change
    create_table :apartments do |t|
      t.string :street
      t.string :city
      t.string :state
      t.string :listing_price
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
