json.array! @apartments do |apartment|
  json.street apartment.street
  json.city apartment.city
  json.state apartment.state
  json.listing_price apartment.listing_price
  json.avatar asset_url(apartment.avatar.url(:med))
end 
